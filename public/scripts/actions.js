const $ = document.getElementById;
let bearer = "";
const loginAction = (e) => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch("/user/login",{
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({username, password}), // body data type must match "Content-Type" header
      }).then(function (response) {
        return response.text();
      })
      .then(function (text) {
        bearer = text;
      });;
      
      
      
}
const rolesAction = async (e) => {
    const resp = await fetch("/user/roles",{
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${bearer}`
        },
      });
      console.log(resp);
}
const userRouteAccessTest = async (e) => {
    const resp = await fetch("/role/getAll",{
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${bearer}`
        },
      });
      console.log(resp);
}