const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

const repos = require('./mock').map(repo => {
  const { name, language, star_count } = repo
  return {
    repository_name: name,
    language,
    star_count,
  }
})

app.get('/repositories', (req, res) => {
  const { limit, language, sort } = req.query

  const filtered = language === undefined ? repos : repos.filter(repo => {
    if (repo.language !== null && repo.language.toLowerCase() === language.toLowerCase()) {
      return true
    }
    return false
  })

  const sorted = sort === undefined ? filtered : filtered.sort((a, b) => {
    if (a[sort] > b[sort]) {
      return -1
    } else if (a[sort] < b[sort]) {
      return 1
    }
    return 0
  })

  const results = sorted.slice(0, limit === undefined ? 10 : limit).map(repo => {
    const { repository_name, language, star_count } = repo
    return {
      repository_name,
      language,
      Star_count: star_count,
    }
  })
  const repo_count = results.length

  res.json({
    repo_count,
    language,
    results,
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})