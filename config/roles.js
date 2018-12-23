module.exports = {
  administrator: {
    blog: {
      allowComments: true,
      editComments: true,
      editAllComments: true,
      deleteComments: true,
      deleteAllComments: true
    },
    forum: {
      forums: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      },
      topics: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      },
      messages: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      }
    }
  },
  moderator: {
    blog: {
      allowComments: true,
      editComments: true,
      editAllComments: true,
      deleteComments: true,
      deleteAllComments: true
    },
    forum: {
      forums: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      },
      topics: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      },
      messages: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      }
    }
  },
  user: {
    blog: {
      allowComments: true,
      editComments: true,
      editAllComments: false,
      deleteComments: true,
      deleteAllComments: false
    },
    forum: {
      forums: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      },
      topics: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: false,
        deleteAll: false
      },
      messages: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: false,
        deleteAll: false
      }
    }
  },
  blocked: {
    blog: {
      allowComments: false,
      editComments: false,
      editAllComments: false,
      deleteComments: false,
      deleteAllComments: false
    },
    forum: {
      forums: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      },
      topics: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      },
      messages: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      }
    }
  },
  guest: {
    blog: {
      allowComments: true,
      editComments: false,
      editAllComments: false,
      deleteComments: false,
      deleteAllComments: false
    },
    forum: {
      forums: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      },
      topics: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      },
      messages: {
        create: true,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      }
    }
  }
}