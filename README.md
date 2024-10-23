# Github Action: run SAST

Github Action to run code scanning tool in the CI

## How to use

```yaml
name: SAST

on:
  pull_request:
    branches:
      - "main"

jobs:
  scan:
    name: Scan code changes
    runs-on: ubuntu-latest
    if: ${{ github.actor != 'dependabot[bot]' }}

    steps:
      - uses: actions/checkout@v4
      - uses: Bastion-Technologies/gh-action-run-sast@v1
```
