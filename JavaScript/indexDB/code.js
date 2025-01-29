import { User } from "./User.js";

const DBOpenReq = indexedDB.open("test", 3);

console.log(DBOpenReq);

DBOpenReq.addEventListener("error", console.warn);

DBOpenReq.addEventListener("success", evt => {
  console.log("Success", evt);

  const db = evt.target.result;
  document.querySelector("button#add").addEventListener("click", () => {
    const tx = db.transaction("storeName", "readwrite");
    tx.addEventListener("complete", evt => {
      console.log("Only one transaction complete for 3 adds", evt);
    });

    tx.addEventListener("error", err => {
      console.warn(err);
    });


    const store = tx.objectStore("storeName");
    for (let i = 0; i < 3; i++) {
      const user = new User("Mike", 5 + i);
      user.date.setMilliseconds(i);
      store.add(user);
    }
  });

  document.querySelector("button#get").addEventListener("click", () => {
    const tx = db.transaction("storeName", "readonly");
    tx.addEventListener("complete", evt => {
      console.log("transaction complete", evt);
    });

    tx.addEventListener("error", err => {
      console.warn(err);
    });

    const store = tx.objectStore("storeName");
    const getReg = store.getAll();
    getReg.addEventListener("success", evt => {
      console.log(evt.target.result);
      const users = evt.target.result.map(user => {
        const li = document.createElement("li");
        li.dataset.time = user.date.toLocaleTimeString("en-US");
        li.dataset.age = user.age;
        li.textContent = user.name;
        const get = document.createElement("button");
        const remove = document.createElement("button");
        const update = document.createElement("button");
        get.textContent = "get";
        remove.textContent = "remove";
        update.textContent = "update";
        get.onclick = () => getUser(db, user.date);
        remove.onclick = () => removeUser(db, user.date);
        update.onclick = () => updateUser(db, user);
        li.append(get, remove, update);
        return li;
      });
      document.querySelector("ul#users").textContent = "";
      document.querySelector("ul#users").append(...users);
    });

    getReg.addEventListener("error", err => {
      console.warn(err);
    });
  });
});

function getUser(db, date) {
  const tx = db.transaction("storeName", "readonly");
  tx.addEventListener("complete", evt => {
    console.log("transaction complete", evt);
  });

  tx.addEventListener("error", err => {
    console.warn(err);
  });

  const store = tx.objectStore("storeName");
  const getReg = store.get(date);
  getReg.addEventListener("success", evt => {
    console.log("clicked user:", evt.target.result);
  });

  getReg.addEventListener("error", err => {
    console.warn(err);
  });
}

function removeUser(db, date) {
  const tx = db.transaction("storeName", "readwrite");
  tx.addEventListener("complete", evt => {
    console.log("transaction complete", evt);
  });

  tx.addEventListener("error", err => {
    console.warn(err);
  });

  const store = tx.objectStore("storeName");
  const getReg = store.delete(date);
  getReg.addEventListener("success", evt => {
    console.log("clicked user:", evt.target.result);
    document.querySelector("button#get").click();
  });

  getReg.addEventListener("error", err => {
    console.warn(err);
  });
}

function updateUser(db, user) {
  const tx = db.transaction("storeName", "readwrite");
  tx.addEventListener("complete", evt => {
    console.log("transaction complete", evt);
  });

  tx.addEventListener("error", err => {
    console.warn(err);
  });

  const store = tx.objectStore("storeName");
  user.name += "!!";
  const getReg = store.put(user);
  getReg.addEventListener("success", evt => {
    console.log("clicked user:", evt.target.result);
    document.querySelector("button#get").click();
  });

  getReg.addEventListener("error", err => {
    console.warn(err);
  });
}

DBOpenReq.addEventListener("upgradeneeded", evt => {
  console.log("Upgradeneeded", evt);
  const db = evt.target.result;
  let objectStore = null;
  switch (evt.oldVersion) {
    case 0: {
      if (!db.objectStoreNames.contains("storeName")) {
        objectStore = db.createObjectStore("storeName", { keyPath: "date" });
      }
    }
    case 1: {
      if (!db.objectStoreNames.contains("oldStore")) {
        db.createObjectStore("oldStore", { autoIncrement: true });
      }
    }
    case 2: {
      if (db.objectStoreNames.contains("oldStore")) {
        db.deleteObjectStore("oldStore");
      }
    }
    case 3: {
      objectStore.add(new User("Default user", 69))
    }
  }

  console.log(db);

});



