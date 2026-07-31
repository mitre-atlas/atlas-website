.collection_index_url = "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/index.json"
| .versions = {
    "enabled": true,
    "entries": [
      {
        "name": ("ATLAS v" + $version),
        "version": $version,
        "domains": [
          {
            "name": "ATLAS",
            "identifier": "atlas-atlas",
            "data": ["assets/stix-atlas.json"]
          }
        ]
      }
    ]
  }
| .default_layers = {
    "enabled": true,
    "urls": [
      "assets/layers/atlas_case_study_frequency.json",
      "assets/layers/atlas_layer_matrix.json"
    ]
  }
| .banner = ("MITRE ATLAS Navigator | ATLAS data v" + $version)
| .comment_color = "#FFF601"
| .link_color = "#1BB0E6"
| .metadata_color = "#005B94"
| .features = (.features | map(
    if .name == "leave_site_dialog" then
      .enabled = false
    elif .name == "header" then
      .enabled = true
    else
      .
    end
  ))
