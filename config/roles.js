module.exports = {
  administrator: {
    blog: {
      comments: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      },
      articles: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      }
    },
    forum: {
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
      comments: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      },
      articles: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: true,
        deleteAll: true
      }
    },
    forum: {
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
      comments: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: false,
        deleteAll: false
      },
      articles: {
        create: true,
        editOwn: true,
        deleteOwn: true,
        editAll: false,
        deleteAll: false
      }
    },
    forum: {
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
      comments: {
        create: false,
        editOwn: false,
        deleteOwn: true,
        editAll: false,
        deleteAll: false
      },
      articles: {
        create: false,
        editOwn: false,
        deleteOwn: true,
        editAll: false,
        deleteAll: false
      }
    },
    forum: {
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
      comments: {
        create: true,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      },
      articles: {
        create: false,
        editOwn: false,
        deleteOwn: false,
        editAll: false,
        deleteAll: false
      }
    },
    forum: {
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