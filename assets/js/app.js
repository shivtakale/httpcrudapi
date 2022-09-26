let cl = console.log;

const postInfo = document.getElementById('postInfo');
//CRUD
const postForm = document.getElementById("postForm");
const title = document.getElementById("title");
const info = document.getElementById("info");
const updateBtn = document.getElementById("updateBtn");
const submitBtn = document.getElementById("submitBtn");


let baseUrl = `https://jsonplaceholder.typicode.com/posts`;
let postArray = []
function makeNetworkCall(methodName, url, body){
    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();

        xhr.open(methodName, url);
        xhr.onload = function(){
            if (xhr.status === 200 || xhr.status === 201) {
                cl(xhr.response);
                resolve(xhr.response)
                let data = JSON.parse(xhr.response);
                templating(data);
            }else {
                reject(`something went wrong`);
            }    
        };
        
        xhr.send(body);  
    })
}
makeNetworkCall( 'GET', baseUrl)
    .then(res => {
        postArray = JSON.parse(res);
        templating(postArray)
    })
    .catch(cl)
const OnEditHandler = (ele) => {
    cl(ele)
    // let getId = Number(ele.dataset.id);
    let getId = +(ele.dataset.id);
    localStorage.setItem('setUpdateId' , getId);
    cl(getId)
    // let obj = postArray.filter(post => post.id === getId);
    let obj = postArray.find(post => post.id === getId);
    cl(obj)

    title.value = obj.title;
    info.value = obj.body;
    updateBtn.classList.remove('d-none')
    submitBtn.classList.add('d-none')
}
const OnDeleteHandler = (ele) => {
    cl(ele)
    let getDeleteId = ele.dataset.id;
    cl(getDeleteId);
    let deleteUrl = `${baseUrl}/${getDeleteId}`
    makeNetworkCall('DELETE', deleteUrl);
    postArray = postArray.filter(post => post.id != getDeleteId);
    templating(postArray);
}

function templating(arr){
    let result = '';
    arr.forEach((ele, i) => {
        result += `
        <tr>
            <td>${i + 1}</td>
            <td>${ele.userId}</td>
            <td>${ele.title}</td>
            <td>${ele.body}</td>
            <td><button class="fa-solid fa-pen-to-square" data-id="${ele.id}" onclick = 'OnEditHandler(this)'></button></td>
            <td><button class="fa-solid fa-trash-can" data-id="${ele.id}" onclick = 'OnDeleteHandler(this)'></button></td>
        </tr>
        `
    });
    postInfo.innerHTML = result;
}

const onSubmitHandler = (eve) => {
    eve.preventDefault();
    cl("submitted")
    let obj = {
        title : title.value,
        body : info.value,
        userId : Math.floor(Math.random()*10) + 1,
    };
    makeNetworkCall("POST", baseUrl, JSON.stringify(obj))
        .then(res => {
            obj.id = JSON.parse(res).id;
            postArray.push(obj);
            templating(postArray);
            cl(obj)
        })
        .catch(cl)
    eve.target.reset()
};
const onUpdateHandler = () =>{
    let getId = +localStorage.getItem('setUpdateId');
    postArray.forEach(obj =>{
        if(obj.id === getId){
            obj.title = title.value;
            obj.body = info.value;
        }
    })
    templating(postArray)
    let updateObj = {
        title : title.value,
        body : info.value
    }
    let updateUrl = `${baseUrl}/${getId}`
    makeNetworkCall('PATCH', updateUrl, JSON.stringify(updateObj))
    postForm.reset();
    updateBtn.classList.add('d-none')
    submitBtn.classList.remove('d-none')
}
postForm.addEventListener('submit', onSubmitHandler)
updateBtn.addEventListener('click', onUpdateHandler)