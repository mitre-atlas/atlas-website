var e=`#### May 2026

Starting with this release, there is a split in versioning between the ATLAS Knowledge Base content and the ATLAS Data Format. Monthly ATLAS content releases will follow a YYYY.MM.N versioning scheme with the version stored in the Collection object. ATLAS data format changes will follow semantic versioning. Previously, changes to either content or format were conflated in a single SemVer version.

##### Website v5.0.0

- Updated the site to support the ATLAS v6 data format
- Added filter for technique platforms to the ATLAS matrix view
- Added support for browsing old versions of the ATLAS data and the ability to permalink to a specific version
- Added a [Version History](/resources/versions) page that includes links to historical versions of the ATLAS data
- Updated styling of ATLAS object properties sidebar and improved consistency across pages
- Updated display of references for all ATLAS objects
- Centralized property definitions in a single location
- Updated ATLAS data to version 2026.05

##### Data v2026.05

- All techniques are updated to include one or more platforms (Predictive AI, Generative AI, Agentic AI, Enterprise).

##### Data Format v6.0.0

- Introduced a new ATLAS YAML format
  - stronger consistency, normalized object modeling, and first-class relationship representation
  - added platforms field to techniques
- Added full validation and data management tooling
  - Pydantic schemas for strict schema validation
  - SQLAlchemy ORM models for persistent versioned content management
  - REST API for managing and updating ATLAS data
- Removed the old workflow for constructing ATLAS.yaml
- Added/updated downstream generation scripts for STIX, Excel, and Navigator outputs
  - centralized all downstream scripts to the atlas-data repository
- Added a test suite for the API
- Migrated and preserved historical ATLAS releases:
  - historical content retained under dist/legacy/
  - historical releases migrated into the v6 structure (dist/v6/)
  - release/version mapping tracked in manifest
  - deprecated ATLAS.yaml

---

The ATLAS knowledge base is built from community contributions. We want to acknowledge the following for their contributions for this release:
- The members of the [Center for Threat-Informed Defense](https://ctid.mitre.org/) (CTID) [Secure AI](https://ctid.mitre.org/projects/secure-ai/) project for feedback on new contribution forms.

##### Website v4.14.0

- Added new contribute page with links to new contribution forms
- Updated and expanded contribution forms to allow for tactic, technique, mitigation, case study, and general contributions
- Updated the website to use ATLAS Data v5.6.1

##### Data v5.6.1

Minor fixes to contribution schemas.
`;export{e as t};