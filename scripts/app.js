$(function() {

  let search, timer

  $('.user-input').on('keyup', function(event) {
    clearTimeout(timer)
    
    if (search === $(this).val()) return;

    search = $(this).val()

    if (search.length === 0) return clear()

    let data = {
      client_id: "4de9145a5b6e02989ac4",
      client_secret: "ccbb9bc5d5f416f92aaff53e2ae9bd6dab909012"
    }
    
    let fetchUser, fetchRepos
    timer = setTimeout(async function() {
      if (fetchUser) fetchUser.abort()
      if (fetchRepos) fetchRepos.abort()
      try {
        fetchUser = $.ajax({ url: `https://api.github.com/users/${search}`, data })
        fetchRepos = $.ajax({ url: `https://api.github.com/users/${search}/repos`, data: { ...data, per_page: 100, sort: 'updated: desc' } })
        
        let [user, repos] = await Promise.all([fetchUser, fetchRepos])
        showProfile(user)
        showRepos(repos)

        $('#history')[0].contentWindow.postMessage(search, '*');

      } catch (e) {
        clear()
      }
    }, 300)
  })

  function clear() {
    $('.profile').html('')
    $('.repos').html('')
  }

  function showProfile(user) {
    $('.profile').html(`
      <div class="card">
        <div class="card-header">
          <p class="card-header-title">${user.name}</p>
        </div>
        <div class="user"> 
          <img class="avatar" src="${user.avatar_url}" alt="${user.name}">
          <div class="info">
            <p class="item">关注数 <strong>${user.following}</strong></p>
            <p class="item">粉丝数 <strong>${user.followers}</strong></p>
            <p class="item">仓库数 <strong>${user.public_repos}</strong></p>
            <p class="item">所在地 <strong>${user.location}</strong></p>
          </div>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item" href="${user.html_url}" target="_blank">
            <i class="octicon octicon-mark-github" style="margin-right: 8px"></i>
            Github 主页
          </a>
        </footer>
      </div>`)
  }

  function showRepos(repos) {

    repos.sort((a, b) => b.stargazers_count - a.stargazers_count)

    let reposHTML = repos.map(function(repo) {
      return `<a href="${repo.html_url}" class="panel-block panel-repo" target="_blank">
          <span class="panel-icon"><i class="octicon octicon-repo"></i></span>
          ${repo.name}
          <span class="star-count">${repo.stargazers_count}</span> 
          <i class="octicon octicon-star"></i>
        </a>`
    }).join('')

    let html = `
      <div class="panel">
        <p class="panel-heading repo">
          <i class="octicon octicon-list-unordered"></i>
          仓库列表
        </p>
        ${reposHTML}
      </div>`

    $('.repos').html(html)
  }

  $('.view-history').on('click', function(event) {
    event.preventDefault()
    $('#history').fadeToggle()
  })

  // function debounce(func, wait) {
  //   let timer
  //   return function() {
  //     clearTimeout(timer)
  //     timer = setTimeout(func, wait)
  //   }
  // }
})
