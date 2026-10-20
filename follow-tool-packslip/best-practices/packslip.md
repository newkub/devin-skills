# packslip — Best Practices

Signed release manifests — digests, platform metadata, verification

## Recommended Patterns

- Generate the manifest in the same job that builds and uploads the artifacts, so digests describe the exact published bytes
- Sign in CI with the workflow identity (OIDC + sigstore) and pin the action to the v1 spec line
- Record a sha256 digest per artifact plus `name`, `url`, `format`, and the platform fields (`os`, `arch`, `libc`)
- Declare executable paths in `bin` so installers place the binary without guessing archive layout
- Describe auxiliary resources (man pages, completions, CLI specs, skills) instead of relying on naming conventions
- Verify signer identity and digest on the consumer side before extracting anything
- Use signed release lists for withdrawal, rollback protection and recommended versions
- Treat build provenance as separate evidence and verify it independently

## Common Pitfalls

- Building artifacts after signing, so the published digest no longer matches
- Forgetting to upload `packslip.sigstore.json` to the release it describes
- Omitting `bin` leaves installers unable to locate the executable inside the archive
- Relying on a plain checksum file as if it were a signed manifest
- Assuming the manifest alone prevents a rollback or withdrawal — that needs release lists
- Changing archive contents (adding a file) without regenerating the manifest
- Publishing with an ephemeral key whose identity consumers cannot verify

## Perf Notes

- Generate once per release, not per artifact rebuild, to avoid digest churn
- Keep artifact sets small and stable; many tiny files multiply metadata maintenance
- Verify after download, not during install, so failures surface early

## Do / Don't

| Do | Don't |
|----|-------|
| sign the exact uploaded bytes | rebuild after signing |
| publish the manifest with the release | leave it only in the workflow log |
| declare `bin` and platform fields | rely on filename guessing |
| verify signer + digest | trust a bare checksum |
| use release lists for rollback | assume the manifest covers withdrawal |
