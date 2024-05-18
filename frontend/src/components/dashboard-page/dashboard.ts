import { DeleteUser, GetUsersPaginated } from "../../../wailsjs/go/main/App";
import { main } from "../../../wailsjs/go/models";
import { showFormPage } from "../form-page/form-page";

export function renderDashboard() {
  //apply tailwind css classes
  document.querySelector("#dashboard")!.innerHTML = `
	<div class="flex flex-col h-screen">
		<h1 class="text-xl font-bold text-gray-200">Dashboard</h1>
		<button id='create-cv-btn' class="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded mt-10">Create CV</button>
		<ul id="cvs" class="flex flex-wrap gap-6 my-8"></ul>
		<nav aria-label="Page navigation example">
			<ul id="pagination" class="justify-content-center p-2 m-4 mx-24 bg-zinc-800 rounded-full"></ul>
		</nav>
	</div>
	`;

  document.getElementById("create-cv-btn")?.addEventListener("click", () => {
    showFormPage();
  });

  renderUsers();
}

export async function renderUsers() {
  const { users, total_count } = await getUsers();

  const cvsDiv = document.getElementById("cvs") as HTMLDivElement;
  cvsDiv.innerHTML = "";
  if (users.length === 0) {
    cvsDiv.innerText = "No CVs found.";
  } else {
    cvsDiv.innerHTML = `${users
      .map(
        (user) =>
          `
					<li>
            <a href="#" data-id="${
              user.id
            }" class="flex flex-col w-64 items-center justify-center bg-zinc-800 p-2 rounded-md my-2">
                ${
                  user.picture && user.picture.String !== ""
                    ? `<img src="${user.picture.String}" id="preview-img" class="h-32 w-32 m-4 rounded-full object-cover" alt="user" />`
                    : `<i id="profile-icon" class="fa-solid m-4 fa-circle-user text-center text-9xl h-32 w-32 text-gray-500"></i>`
                }
								<div class="font-semibold max-w-64 line-clamp-1">
									${user.first_name} ${user.last_name}
								</div>
								<i data-id="${
                  user.id
                }" class="delete-btn fa-solid fa-trash bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded mt-10"></i>
            </a>
        	</li>
					`
      )
      .join("")}`;
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

  renderPagination(total_count);
}

let pageNumber = 1;
const pageSize = 3;

function renderPagination(total_count: number) {
  const paginationDiv = document.getElementById("pagination") as HTMLElement;
  const pagesCount = Math.ceil(total_count / pageSize);
  paginationDiv.innerHTML = `
		<ul class="flex justify-between items-center px-2">
			<li>
				<button class="prev-btn btn">
					<i class="fa-solid fa-chevron-left"></i>
				</button>
			</li>
			${Array.from({ length: pagesCount }, (_, i) => i + 1)
        .map((p) =>
          //if selected
          p === pageNumber
            ? `<li>
								<button class="bg-indigo-500 rounded-3xl w-8 h-8 text-center" data-page="${p}">
									${p}
								</button>
							</li>`
            : `<li>
								<button class="rounded-full border w-8 h-8 text-center" data-page="${p}">
									${p}
								</button>
							</li>`
        )
        .join("")}
			<li>
				<button class="next-btn btn">
					<i class="fa-solid fa-chevron-right"></i>
				</button>
			</li>
		</ul>
	`;

  const pageBtns = Array.from(document.getElementsByTagName("button"));
  pageBtns.forEach((btn) => {
    if (!btn.hasAttribute("data-page")) return;
    btn.addEventListener("click", () => {
      pageNumber = parseInt(btn.getAttribute("data-page")!);
      renderUsers();
    });
  });

  const prevBtn = document.querySelector(".prev-btn") as HTMLButtonElement;
  const nextBtn = document.querySelector(".next-btn") as HTMLButtonElement;
  prevBtn.addEventListener("click", () => {
    if (pageNumber <= 1) return;
    pageNumber--;
    renderUsers();
  });

  nextBtn.addEventListener("click", () => {
    if (pageNumber >= pagesCount) return;
    pageNumber++;
    renderUsers();
  });
}

async function getUsers(): Promise<main.paginatedUsersResult> {
  try {
    const result = await GetUsersPaginated(pageNumber, pageSize);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    const users: main.User[] = [];
    return { users, total_count: 0, convertValues: () => {} };
  }
}
