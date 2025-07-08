<script>
    let { links = [], linksPerColumn = 4 } = $props()

    const columns = $derived.by(() => {
        const result = []
        for (let i = 0; i < links.length; i += linksPerColumn) {
            result.push(links.slice(i, i + linksPerColumn))
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
