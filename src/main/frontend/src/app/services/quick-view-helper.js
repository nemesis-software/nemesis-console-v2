export default {
  blog_entry: {
    mainView: [{name: 'code'}, {name: 'title'}, {name: 'catalogVersion'}, {name: 'content'}],
    sideBar: [
      {groupName: 'Status', items: [{name: 'publishDate'}, {name: 'categories', embeddedCreation: true}]},
      {groupName: 'Images', items: [{name: 'picture'}, {name: 'thumbnail', embeddedCreation: true}]},
      {groupName: 'Addition fields', items: [{name: 'teaser'}, {name: 'socialMetadataAttributes'}]},
    ]
  },
  media: {
    mainView: [{name: 'code'}, {name: 'mediaFolder', embeddedCreation: true}, {name: 'previewUrl'}]
  },
  media_folder: {
    mainView: [{name: 'code'}, {name: 'name'}, {name: 'parent'}]
  }
}