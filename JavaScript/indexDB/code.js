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
      console.log("transaction complete", evt);
    });

    tx.addEventListener("error", err => {
      console.warn(err);
    });


    const store = tx.objectStore("storeName");
    store.add(new User("Mike", 5))
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
        li.textContent = `click to get "${user.name}"`;
        li.onclick = () => clickUser(db, user.date);
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

function clickUser(db, date) {
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



