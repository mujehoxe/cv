import { DeleteUser, GetUsersPaginated } from "../../../wailsjs/go/main/App";
import { showFormPage } from "../form-page/form-page";

export function renderDashboard() {
  //apply tailwind css classes
  document.querySelector("#dashboard")!.innerHTML = `
	<div class="flex flex-col h-screen">
		<h1 class="text-xl font-bold text-gray-200">Dashboard</h1>
		<button id='create-cv-btn' class="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded mt-10">Create CV</button>
		<ul id="cvs" class="flex flex-wrap gap-4 mt-4"></ul>
		<nav aria-label="Page navigation example">
		</nav>
	</div>
	`;

  document.getElementById("create-cv-btn")?.addEventListener("click", () => {
    showFormPage();
  });

  renderUsers();
}

export async function renderUsers() {
  const users = await getUsers();

  const cvsDiv = document.getElementById("cvs") as HTMLDivElement;
  cvsDiv.innerHTML = "";
  if (users.length === 0) {
    cvsDiv.innerText = "No CVs found.";
  } else {
    cvsDiv.innerHTML = `${users
      .map(
        (user) =>
          `<li>
            <a href="#" data-id="${
              user.id
            }" class="flex flex-col w-64 items-center justify-center bg-zinc-800 p-2 rounded my-2">
                ${
                  user.picture
                    ? `<img src="${user.picture}" id="preview-img" class="h-32 w-32 m-4 rounded-full object-cover" alt="user" />`
                    : `<i id="profile-icon" class="fa-solid m-4 fa-circle-user text-center text-9xl h-32 w-32 text-gray-500"></i>`
                }
								<div class="font-semibold max-w-64 line-clamp-1">
									${user.first_name} ${user.last_name}
								</div>
								<i data-id="${
                  user.id
                }" class="delete-btn fa-solid fa-trash bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded mt-10"></i>
            </a>
        </li>`
      )
      .join("\n")}`;
  }

  cvsDiv.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("delete-btn")) {
      const userId = target.getAttribute("data-id") as string;
      if (!confirm("Are you sure?")) return;
      await DeleteUser(parseInt(userId));
      renderUsers();
    }
  });
}

async function getUsers() {
  var pageNumber = 0;
  const pageSize = 20;
  var users = [];
  try {
    users = await GetUsersPaginated(pageNumber, pageSize);
    console.log(users);
  } catch (error) {
    console.log(error);
    return [];
  }

  return users;
}
