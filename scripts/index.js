const getUsername = function() {
    return document.cookie.split('=')[1];
}

const sendXMLHttpRequest = function(method, url, reqListener) {
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open(method, url);
    oReq.send();
}

const timeFormatter = function(time) {
    let date = new Date(time);
    return `${date.toDateString()} at ${date.toLocaleTimeString()}`;
}

const renderCollapsePanel = function(id, innerHtml) {
    return `
        <div class="panel panel-default">
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="list-group-item" id="${id}" data-toggle="collapse" data-parent="#repos" href="#collapse${id}" onclick="showDetailedRepo(event)">
                        ${innerHtml}
                    </a>
                </h4>
            </div>
            <div id="collapse${id}" class="panel-collapse collapse">
                <div class="panel-body">
                </div>
            </div>
        </div>`
}

const showDetailedRepo = function(event) {
    const repoId = event.target.id
    const repoName =  document.getElementById(`${repoId}`).innerText;
    const renderRepoInformation = function(){
        let repoInfo = JSON.parse(this.responseText);
        let createdAt = `<dt>Created: </dt><p>${timeFormatter(repoInfo.created_at)}</p>`;
        let lastPushedAt = `<dt>Last Pushed: </dt><p>${timeFormatter(repoInfo.pushed_at)}</p>`;
        let cloneUrl = `<dt>Clone URL: </dt><p>${repoInfo.clone_url}</p>`;
        let language = `<dt>Language: </dt><p><font color="${languageColor[repoInfo.language]}">&#11044 </font>${repoInfo.language}</p>`;
        repoInfo = createdAt + lastPushedAt + cloneUrl + language;
        document.querySelector(`#collapse${repoId} > .panel-body`).innerHTML = repoInfo;
    }
    sendXMLHttpRequest('GET',`https://api.github.com/repos/${getUsername()}/${repoName}`,renderRepoInformation);
}

const renderRepoLists = function() {
    const reqListener = function() {
        let repos = JSON.parse(this.responseText);
        let repoNames = '';
        repos.map((repository, index) => {
            let innerHtml = `<section>${repository.name}</section>`;
            if (repository.fork) {
                innerHtml = `
                    <section>${repository.name}
                        <img class="pull-right" src="images/fork.svg" alt="forked"  height="20" width="18">
                    </section>`
            }
            repoNames += renderCollapsePanel(index, innerHtml);
        });
        document.querySelector("#repos").innerHTML = repoNames;
    }
    sendXMLHttpRequest('GET',`https://api.github.com/users/${getUsername()}/repos`,reqListener);
}

const renderProfileInformation = function() {
    const reqListener = function() {
        let user = JSON.parse(this.responseText);
        let avatar = `<img class="img-thumbnail img-responsive" src="${user.avatar_url}" alt="">`;
        let loginName = `<h2>${user.login} <small>${user.name}</small></h2>`;
        let bio = `<dt>Bio:</dt> <pre>${user.bio}</pre>`;
        let followers = `<dt>Followers:</dt> <p>${user.followers}</p>`;
        let following = `<dt>Following:</dt> <p>${user.following}</p>`;
        let publicRepos = `<dt>Public Repos:</dt> <p>${user.public_repos}</p>`;
        let publicGists = `<dt>Public Gists:</dt> <p>${user.public_gists}</p>`;
        let userDetails = loginName + bio + followers + following + publicRepos + publicGists;
        document.querySelector("#avatar").innerHTML = avatar;
        document.querySelector("#githubName").innerHTML = userDetails;
    }
    sendXMLHttpRequest('GET',`https://api.github.com/users/${getUsername()}`,reqListener);
}

const animateProgress = function() {
    document.querySelector(".input-group").style.visibility = "hidden";
    document.querySelector(".progress").style.display = "block";
    setTimeout(() => {
        document.querySelector(".progress").style.display = "none";
        const username = document.querySelector("#username").value;
        document.cookie = `username=${username}`
        renderProfileInformation();
        document.querySelector("h3").style.display = "block";
        renderRepoLists();
    }, 3400);
}