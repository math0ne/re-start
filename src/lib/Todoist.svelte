<script>
    import { onMount } from 'svelte'
    import TodoistAPI from './TodoistAPI.js'

    // Props
    let { token } = $props()

    // State
    let tasks = $state([])
    let loading = $state(true)
    let error = $state('')
    let api = null

    onMount(async () => {
        if (!token) {
            error = 'No API token provided'
            loading = false
            return
        }

        try {
            api = new TodoistAPI(token)
            await loadTasks()
        } catch (err) {
            error = `Failed to load tasks: ${err.message}`
            loading = false
        }
    })

    async function loadTasks() {
        if (!api) return

        try {
            loading = true
            error = ''
            await api.sync()
            tasks = api.getTasks()
        } catch (err) {
            error = `Failed to sync tasks: ${err.message}`
        } finally {
            loading = false
        }
    }

    async function completeTask(taskId) {
        if (!api) return

        try {
            // Optimistic update - remove task immediately for better UX
            tasks = tasks.filter((task) => task.id !== taskId)

            await api.completeTask(taskId)
        } catch (err) {
            error = `Failed to complete task: ${err.message}`
            // Reload tasks if the completion failed
            await loadTasks()
        }
    }

    function formatDueDate(dueString) {
        if (!dueString) return ''

        const due = new Date(dueString)
        const today = new Date()
        const daysDiff = Math.floor(
            (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysDiff < 0) return 'overdue'
        if (daysDiff === 0) return 'today'
        if (daysDiff === 1) return 'tmrw'

        return due
            .toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            })
            .toLowerCase()
    }

    function getDueDateClass(dueString) {
        if (!dueString) return ''

        const due = new Date(dueString)
        const today = new Date()
        const daysDiff = Math.floor(
            (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysDiff < 0) return 'overdue'
        if (daysDiff === 0) return 'today'
        return ''
    }
</script>

<div class="todoist">
    <div class="widget-header">
        {tasks.length}
        {tasks.length === 1 ? 'task' : 'tasks'}
        <button onclick={loadTasks} disabled={loading} class="refresh">
            {loading ? 'loading...' : 'refresh'}
        </button>
    </div>
    <br />
    {#if tasks.length === 0}
        <div class="empty-state">
            <p>no tasks left! :)</p>
        </div>
    {:else}
        <div class="tasks-list">
            {#each tasks as task}
                <div class="task">
                    <button
                        onclick={() => completeTask(task.id)}
                        class="checkbox"
                    >
                        [ ]
                    </button>
                    <span class="task-title">{task.content}</span>
                    {#if task.due}
                        <span class="task-due {getDueDateClass(task.due.date)}">
                            {formatDueDate(task.due_date)}
                        </span>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .task-due {
        color: var(--txt-3);
    }
    .refresh {
        color: var(--txt-3);
    }
</style>
