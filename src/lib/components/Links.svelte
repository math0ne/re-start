<script>
    import { settings } from '../settings-store.svelte.js'

    const columns = $derived.by(() => {
        const result = []
        for (
            let i = 0;
            i < settings.links.length;
            i += settings.linksPerColumn
        ) {
            result.push(settings.links.slice(i, i + settings.linksPerColumn))
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
