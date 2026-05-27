# MITRE ATLAS Data

This repository distributes data for [MITRE ATLAS&trade;](https://atlas.mitre.org/) (Adversarial Threat Landscape for AI Systems), a public knowledge base of adversary TTPs targeting AI systems.

It includes the supporting tooling for parsing, validating, and managing ATLAS data.

## Quick Start with ATLAS Data

Install uv: https://docs.astral.sh/uv/getting-started/installation/

Install dependencies:
```bash
uv sync
```

Activate virtual environment:
```bash
source .venv/bin/activate
```

Parse and validate ATLAS data in Python:
```python
import yaml
from pathlib import Path
from atlas.schemas import AtlasExport

path = Path("dist/ATLAS-latest.yaml")

with path.open("r") as f:
    raw = yaml.safe_load(f)

atlas_data = AtlasExport.model_validate(raw)

print("Release version:", atlas_data.collection.version)
print("Tactics:", len(atlas_data.tactics))
print("Techniques:", len(atlas_data.techniques))
print("Mitigations:", len(atlas_data.mitigations))
print("Relationships:", len(atlas_data.relationships))
```

## Project layout

- `dist/` - distributed ATLAS data files and the release manifest.
- `atlas/` - ATLAS Python package containing Pydantic schemas and REST API
- `tools/` - command-line tooling to populate ATLAS YAML into the database and generate additional distribution formats (STIX, Navigator layers, Excel).
- `tests/` - test suite for ATLAS data and REST API
- `.github/workflows/` - CI workflows for release asset generation


## Distributed ATLAS Data

The latest ATLAS data is stored in `dist/ATLAS-latest.yaml`

### Versioning

ATLAS releases monthly content updates. It follows two versioning schemes:

- **Content version**: data content version in `collection.version` that follows YYYY.MM.N versioning (e.g. `2026.05`).
- **Format version**: data format version in `format-version` that follows semantic versioning (e.g. `6.0.0`).

`dist/manifest.yaml` ties these together by listing which file path implements which format-version for each release.

Note: separating content from format versions started with 2026.05 / 6.0.0. Previously content and format changes followed combined SEMVER versioning.

### Distributed Versions

A summary of distributed ATLAS YAML files:

- `dist/ATLAS-latest.yaml` will always point to the latest content in the latest format.
- `dist/v6/ATLAS-latest.yaml` will always point to the latest content in v6 format.
- `dist/v6/ATLAS-{version}.yaml` contain historical versions of ATLAS migrated to v6 format.
- `dist/legacy/ATLAS-{version}.yaml` contain historical versions of ATLAS in their original format at time of release.
- `dist/ATLAS.yaml` is deprecated and will no longer be updated.

The manifest (`dist/manifest.yaml`) contains a complete listing of distributed files. It maps each content release to one or more files by `format-version`.

## ATLAS Data Format

Current distributable ATLAS format is represented by `atlas.schemas.AtlasExport`.

Top-level keys:

- `format-version`
- `collection`
- `matrix`
- `tactics`
- `techniques`
- `mitigations`
- `case-studies`
- `relationships`

High-level shape (abbreviated):

```yaml
format-version: 6.0.0

collection:
  id: ATLAS-collection
  version: "2026.05"
  name: ATLAS
  description: Adversarial Threat Landscape for AI Systems

matrix:
  id: ATLAS-matrix
  name: ATLAS

tactics:
  AML.TA0002:
    id: AML.TA0002
    object-type: tactic
    name: Reconnaissance

techniques:
  AML.T0005:
    id: AML.T0005
    object-type: technique
    maturity: Demonstrated
    platforms:
      - Predictive AI

mitigations:
  AML.M0001:
    id: AML.M0001
    object-type: mitigation

case-studies:
  AML.CS0001:
    id: AML.CS0001
    object-type: case-study
    type: Incident

relationships:
  ATLAS-matrix:
    sequences: [...]
  AML.T0005:
    achieves: [...]
  AML.M0001:
    mitigates: [...]
  AML.CS0001:
    employs: [...]
```

### ID conventions

The format enforces typed ID patterns, including:

- Collection ID: `ATLAS-collection`
- Matrix ID: `ATLAS-matrix`
- Tactic ID: `AML.TA####`
- Technique ID: `AML.T####`
- Sub-technique ID: `AML.T####.###`
- Mitigation ID: `AML.M####`
- Case study ID: `AML.CS####`

### Relationship types

ATLAS object relationships are explicit and typed:

- `sequences`: matrix -> tactic (ordered matrix layout)
- `achieves`: technique -> tactic
- `specializes`: sub-technique -> parent technique
- `mitigates`: mitigation -> technique
- `employs`: case study -> technique (includes `tactic`, `step-id`, `leads-to` metadata)

## REST API

The REST API is designed to manage the ATLAS data. Data can be imported from a v6 ATLAS YAML file, modified via calls the the API, and exported for distribution.

The API is backed by a SQLite database stored at `sqlite:///./atlas.db`.

### Quick Start with the API

Install uv: https://docs.astral.sh/uv/getting-started/installation/

Install dependencies:
```bash
uv sync
```

Activate virtual environment:
```bash
source .venv/bin/activate
```

Load atlas data into the database:
```bash
uv run populate-atlas-db -i dist/v6/ATLAS-2026.05.yaml
```

Run API locally:
```bash
fastapi run atlas/api.py --reload
```

It is now possible to browse the api docs at http://localhost:8000/docs

Export the data from the API:
```bash
curl http://localhost:8000/versions/2026.05/data -o ATLAS-export.yaml
```

### REST API Endpoints

- health:
  - `GET /health`
- version management:
  - `POST /versions`
  - `GET /versions`
  - `GET /versions/{version}`
  - `PATCH /versions/{version}`
  - `DELETE /versions/{version}`
  - `GET /versions/{version}/data` (exports version as YAML)
- data management (version-scoped):
  - `/{version}/collection/`
  - `/{version}/matrix/`
  - `/{version}/tactics/`
  - `/{version}/techniques/`
  - `/{version}/mitigations/`
  - `/{version}/case-studies/`

## Tools

Tools for generating downstream data formats.

### ATLAS to STIX

Entrypoint: `atlas-to-stix` (`tools/atlas_to_stix.py`)

Generate ATLAS STIX:
```bash
uv run tools/atlas_to_stix.py -i dist/v6/ATLAS-2026.05.yaml -o dist/stix-atlas.json
```

Generate ATLAS + ATT&CK Enterprise STIX bundle:
```bash
uv run tools/atlas_to_stix.py -i dist/v6/ATLAS-2026.05.yaml --include-attack -o dist/stix-atlas-attack-enterprise.json
```

Other options:
- `--include-case-studies`
- `--maturity-threshold {feasible,demonstrated,realized}`
- `--url`, `--source_name`, `--identity_name`

### ATLAS to Excel

Entrypoint: `atlas-to-excel` (`tools/atlas_to_excel.py`)

Generate ATLAS Excel workbooks:
```bash
uv run atlas-to-excel -i dist/v6/ATLAS-2026.05.yaml
```

Default output directory: `dist/excel-files/`

### Generate ATLAS Navigator layers

Entrypoint: `generate-navigator-layers` (`tools/generate_navigator_layers.py`)

Generate Navigator layers:
```bash
uv run generate-navigator-layers -i dist/v6/ATLAS-2026.05.yaml
```

## Release Statement

Approved for Public Release; Distribution Unlimited. Public Release Case Number 26-1162
©2026 The MITRE Corporation. ALL RIGHTS RESERVED.
