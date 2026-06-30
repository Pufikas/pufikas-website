# Adding your own site
Before submitting a pull request, please add my 88×31 button somewhere on your website.

After all, how can we call it a neighborhood if we aren't linking to each other?


To add your own you will need to clone this repository (or edit via browser) and submit a pull request.

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
        // "img": "/src/buttons/pufikas88x31.png",

        // alternative button path (use this if you don't know which one to use)
        "img": "/src/neighborhood/buttons/pufikas88x31.png",

        // your website tags maximum of 5, select tags only defined from tags.md file (full raw list in tag_list.json)
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
      "tags": ["blog", "touhou"]
    }
  ]
}
```

Make sure that your json is valid! Atleast one tag is required.

Feel free to add more tags! (Add your tag in `tag_list.json` and `tags.md`)