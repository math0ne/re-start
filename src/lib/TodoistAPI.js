/**
 * Todoist API client using the Sync endpoint for efficient data retrieval
 */
class TodoistAPI {
    constructor(token) {
        this.token = token
        this.baseUrl = 'https://api.todoist.com/api/v1'
        this.syncTokenKey = 'todoist_sync_token'
        this.syncToken = localStorage.getItem(this.syncTokenKey) || '*'
        this.dataKey = 'todoist_data'
        this.data = JSON.parse(localStorage.getItem(this.dataKey) || '{}')
    }

    /**
     * Perform a sync request to get tasks and related data
     */
    async sync(
        resourceTypes = ['items', 'labels', 'projects'],
        isRetry = false
    ) {
        const formData = new FormData()
        formData.append('sync_token', this.syncToken)
        formData.append('resource_types', JSON.stringify(resourceTypes))

        try {
            const response = await fetch(`${this.baseUrl}/sync`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error(`todoist fetch failed: ${response.status}`)
            }

            const data = await response.json()

            // Update local data
            this.updateLocalData(data)

            // Store sync token for next request
            this.syncToken = data.sync_token
            localStorage.setItem(this.syncTokenKey, this.syncToken)

            console.log(data)

            return data
        } catch (error) {
            console.error('sync error:', error)

            // Retry with full sync once
            if (!isRetry && this.syncToken !== '*') {
                console.log('retrying with full sync...')
                this.syncToken = '*'
                localStorage.setItem(this.syncTokenKey, this.syncToken)
                return this.sync(resourceTypes, true)
            }

            // If we already tried or this was a full sync, give up
            throw error
        }
    }

    /**
     * Update local data storage with sync response
     */
    updateLocalData(syncData) {
        if (syncData.full_sync) {
            // Full sync - replace all data
            this.data = {
                items: syncData.items || [],
                labels: syncData.labels || [],
                projects: syncData.projects || [],
            }
        } else {
            // Incremental sync - merge updates
            if (syncData.items) {
                this.mergeItems(syncData.items)
            }
            if (syncData.labels) {
                this.mergeLabels(syncData.labels)
            }
            if (syncData.projects) {
                this.mergeProjects(syncData.projects)
            }
        }

        localStorage.setItem(this.dataKey, JSON.stringify(this.data))
    }

    /**
     * Merge updated items into local data
     */
    mergeItems(newItems) {
        if (!this.data.items) this.data.items = []

        newItems.forEach((newItem) => {
            if (newItem.is_deleted) {
                // Remove deleted
                this.data.items = this.data.items.filter(
                    (item) => item.id !== newItem.id
                )
            } else {
                // Update or add item
                const existingIndex = this.data.items.findIndex(
                    (item) => item.id === newItem.id
                )
                if (existingIndex >= 0) {
                    this.data.items[existingIndex] = newItem
                } else {
                    this.data.items.push(newItem)
                }
            }
        })
    }

    /**
     * Merge updated labels into local data
     */
    mergeLabels(newLabels) {
        if (!this.data.labels) this.data.labels = []

        newLabels.forEach((newLabel) => {
            if (newLabel.is_deleted) {
                this.data.labels = this.data.labels.filter(
                    (label) => label.id !== newLabel.id
                )
            } else {
                const existingIndex = this.data.labels.findIndex(
                    (label) => label.id === newLabel.id
                )
                if (existingIndex >= 0) {
                    this.data.labels[existingIndex] = newLabel
                } else {
                    this.data.labels.push(newLabel)
                }
            }
        })
    }

    /**
     * Merge updated projects into local data
     */
    mergeProjects(newProjects) {
        if (!this.data.projects) this.data.projects = []

        newProjects.forEach((newProject) => {
            if (newProject.is_deleted) {
                this.data.projects = this.data.projects.filter(
                    (project) => project.id !== newProject.id
                )
            } else {
                const existingIndex = this.data.projects.findIndex(
                    (project) => project.id === newProject.id
                )
                if (existingIndex >= 0) {
                    this.data.projects[existingIndex] = newProject
                } else {
                    this.data.projects.push(newProject)
                }
            }
        })
    }

    /**
     * Get upcoming tasks (similar to Todoist inbox view)
     */
    getTasks() {
        if (!this.data.items) return []

        return this.data.items
            .filter((item) => !item.checked && !item.is_deleted)
            .map((item) => {
                let dueDate = null

                if (item.due) {
                    const dueDateStr = item.due.date

                    // Check if it's date-only (YYYY-MM-DD) or includes time (YYYY-MM-DDTHH:MM:SS)
                    if (dueDateStr.includes('T')) {
                        dueDate = new Date(dueDateStr)
                    } else {
                        dueDate = new Date(dueDateStr + 'T23:59:59')
                    }
                }

                return {
                    ...item,
                    project_name: this.getProjectName(item.project_id),
                    label_names: this.getLabelNames(item.labels),
                    due_date: dueDate,
                }
            })
            .sort((a, b) => {
                // Sort by: due date, then no date, then child order
                if (a.due_date && b.due_date) {
                    return a.due_date - b.due_date
                }
                if (a.due_date && !b.due_date) return -1
                if (!a.due_date && b.due_date) return 1
                return a.child_order - b.child_order
            })
    }

    /**
     * Get project name by ID
     */
    getProjectName(projectId) {
        if (!this.data.projects) return ''
        const project = this.data.projects.find((p) => p.id === projectId)
        return project ? project.name : ''
    }

    /**
     * Get label names by label IDs
     */
    getLabelNames(labelIds) {
        if (!this.data.labels || !labelIds) return []
        return labelIds
            .map((id) => this.data.labels.find((l) => l.id === id))
            .filter(Boolean)
            .map((label) => label.name)
    }

    /**
     * Complete a task
     */
    async completeTask(taskId) {
        const commands = [
            {
                type: 'item_complete',
                uuid: crypto.randomUUID(),
                args: {
                    id: taskId,
                },
            },
        ]

        return this.executeCommands(commands)
    }

    /**
     * Execute sync commands
     */
    async executeCommands(commands) {
        const formData = new FormData()
        formData.append('commands', JSON.stringify(commands))

        try {
            const response = await fetch(`${this.baseUrl}/sync`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error(
                    `todoist command fetch failed: ${response.status}`
                )
            }

            const data = await response.json()

            // Update local data with any changes
            if (data.sync_status) {
                // Command was successful, perform an incremental sync to update local data
                await this.sync()
            }

            return data
        } catch (error) {
            console.error('todoist command execution error:', error)
            throw error
        }
    }

    /**
     * Clear local storage (for testing or reset)
     */
    clearLocalData() {
        localStorage.removeItem(this.syncTokenKey)
        localStorage.removeItem(this.dataKey)
        this.syncToken = '*'
        this.data = {}
    }
}

export default TodoistAPI
