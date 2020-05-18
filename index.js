const prompts = require('prompts')
const axios = require('axios')
const figlet = require('figlet')
const ora = require('ora')
const colors = require('colors')
const moment = require('moment')

const BASE_API_URL = 'https://api.github.com/users/'

async function getUser () {
  figlet('G h u s e r', async (err, data) => {
    if (!err) {
      console.log(colors.rainbow(data))
      const response = await prompts({
        type: 'text',
        name: 'username',
        message: 'Enter Github username:',
        validate: value => (value === '' ? `Username shouldn't be empty` : true)
      })

      if (response.username) {
        const spinner = ora('Fetching user details').start()
        try {
          const { data } = await axios.get(BASE_API_URL + response.username)
          spinner.stop()
          const {
            name,
            following,
            followers,
            public_repos,
            location,
            created_at
          } = data
          console.log(`        Name: ${colors.rainbow(name)}`.bold)
          console.log(`   Following: ${following}`)
          console.log(`   Followers: ${followers}`)
          console.log(` Public repo: ${public_repos}`)
          console.log(`    Location: ${location || '🌍'}`)
          console.log(`Member Since: ${moment(created_at).fromNow(true)}`)
        } catch (err) {
          spinner.stop()
          console.log('Invalid Username or Server Error'.red)
          getUser()
        }
      }
    }
  })
}

getUser()
