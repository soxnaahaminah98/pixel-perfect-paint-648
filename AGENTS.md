# Architecture decisions

- Keep equipment data and client-side status updates in the shared parc store so every public route reads one consistent inventory.
- Treat 30 September 2026 as the dashboard maintenance reference date so the requested MVP metrics remain deterministic.
- Keep incident reporting client-side until the user approves the Cloud-backed tickets and roles phase.
<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
