The following is a breakdown of the schema that is used by the various views to build out each page. 

```
{
    "id": "str", // id of item being displayed on the view
    "name": "str", // item name
    "description": "str", // item description
    "object-type": "str", // type of item: tactic, technique, mitigation
    "created_date": "date",
    "modified_date": "date",
    "route": "str", // endpoint/route of item relative to the application. Loads up the view with the data
    // present in technique and tactic items
    "ATT&CK-reference": {
        "id": "str", // id of ATT&CK reference linked to item
        "url": "str" // url to ATT&CK refernce linked to item
    },
    // present in mitigation and tactics
    "techniques": [
        {
            "id": "str",
            "name": "str",
            "description": "str",
            "object-type": "technique",
            "ATT&CK-reference": {
                "id": "str", // id of ATT&CK reference linked to item
                "url": "str" // url to ATT&CK refernce linked to item
            },
            "tactics": [
                "" // list of tactics that an adversary might use while employing attack technique
            ],
            "created_date": "date",
            "modified_date": "date",
            "maturity": "str",
            "route": "str",
            "label": "str"
        }
    ],
    // only present in technique items
    "tactics": [
        "" // list of tactics that an adversary might use while employing attack technique
    ],
    "maturity": "str",
    "label": "str",
    "subtechniques": [
        {
            "id": "str", 
            "name": "str", 
            "description": "str", 
            "object-type": "str", 
            "subtechnique-of": "str", 
            "created_date": "str", 
            "modified_date": "str", 
            "maturity": "str", 
            "route": "str", 
            "label": "str"
        }
    ],
    // only present in mitigation
    "ml-lifecycle": [
        ""
    ],
    "category": [
        ""
    ],
    // present in all objects
    "realtedObjects": {
        "category": [], // mitigation
        "ml-lifecycle": [], // mitigation
        "techniques": [], // mitigation
        "ATT&CK-reference":  {}, // technique, tactic
        "case-study": [], // technique, tactic
        "maturity": "str", // technique
        "mitigation": [], // technique
        "subtechniques": [], //technique
        "tactic": [], // technique
        "technique": [] // tactic
    }
}
```