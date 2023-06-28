const deleteButton = document.querySelectorAll(".delete");

deleteButton.forEach((element) => {
  const postId = element.dataset.postid;

  element.addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:3000/guide/delete", {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });
      res.json().then((data) => {
        location = "http://localhost:3000" + data.resLocation;
      });
    } catch (error) {
      console.log(error);
    }
  });
});

const updateButton = document.querySelectorAll(".update");

updateButton.forEach((element) => {
  const postId = element.dataset.postid;
  element.addEventListener("click", async () => {
    window.location = "http://localhost:3000/guide/edit/" + postId;
  });
});
