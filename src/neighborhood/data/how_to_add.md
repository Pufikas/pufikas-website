# Adding your own site
To add your own you will need to clone this repository and submit a pull request.

1. Navigate to `sites.json` and at the end of the sites array add your own website details.

2. Upload your website's button must be 88x31 in size, add it to `buttons` folder.

```json
{
        // used for getting the parent node must be unique
        "id": "Pufikas", 
        
        // name that appears on your node hover
        "name": "Pufikas",

        // link to your website
        "url": "https://pufikas.nekoweb.org/", 

        // your img source, which you need to place at /src/buttons/, must be exactly 88x31 of size
        "img": "/src/buttons/pufikas88x31.png", 

        // your website tags maximum of 5, select tags only defined from tags.md file
        "tags": ["vocaloid", "linux"],
    },
```

3. If everything is fine submit a pull request and I will review it!

### Final example should look like this
```js
{
  "sites": [
    ...
    {
      ...
    },
    {
      ...
    },
    {
      "id": "me",
      "name": "me",
      "url": "https://somewhere",
      "img": "/src/neighborhood/buttons/me.png",
      "tags": ["blogs", "touhou"]
    }
    ...
  ]
}
```


Make sure that your json is valid! Atleast one tag is required.

There are 2 folders where I store buttons.
`/src/neighborhood/buttons/`
`/assets/buttons/`

If you can't find the button in `/assets/buttons/`
use the `/src/neighborhood/buttons/` folder.
