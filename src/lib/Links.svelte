<script>
    const columnHeight = 4
    const links = [
        { title: 'gmail', url: 'https://mail.google.com' },
        { title: 'calendar', url: 'https://calendar.google.com' },
        { title: 'drive', url: 'https://drive.google.com' },
        { title: 'docs', url: 'https://docs.google.com' },
        { title: 'github', url: 'https://github.com' },
        { title: 'slack', url: 'https://slack.com' },
        { title: 'todoist', url: 'https://todoist.com' },
        { title: 'keep', url: 'https://keep.google.com' },
        { title: 'perplexity', url: 'https://perplexity.ai' },
        { title: 'claude', url: 'https://claude.ai' },
        { title: 'aistudio', url: 'https://aistudio.google.com' },
        { title: 'chatgpt', url: 'https://chat.openai.com' },
        { title: 'youtube', url: 'https://youtube.com' },
        { title: 'reddit', url: 'https://reddit.com' },
        { title: 'twitter', url: 'https://x.com' },
        { title: 'feedly', url: 'https://feedly.com' },
    ]

    const columns = $derived.by(() => {
        const result = []
        for (let i = 0; i < links.length; i += columnHeight) {
            result.push(links.slice(i, i + columnHeight))
        }
        return result
    })
</script>

<div class="links">
    {#each columns as column}
        <div class="column">
            {#each column as link}
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link"
                >
                    {link.title}
                </a>
                <br />
            {/each}
        </div>
    {/each}
</div>

<style>
    .links {
        display: flex;
        gap: 3rem;
        flex-wrap: wrap;
    }
</style>
