import {
  DeleteUser,
  GetUsersPaginated,
  SearchUsers,
} from "../../../wailsjs/go/main/App";
import { main } from "../../../wailsjs/go/models";
import { renderError } from "../form-page/error";
import { showFormPage, showUpdateProfileForm } from "../form-page/form-page";
import {
  closeFloatingLoadingIndicator,
  renderFloatingLoadingIndicator,
} from "../form-page/loadingIndicator";

const pageSize = 10;
let pageNumber = 1;

export function renderDashboard() {
  //apply tailwind css classes
  document.querySelector("#dashboard")!.innerHTML = `
	<div class="flex flex-col justify-center text-sm">
		<h1 class="text-xl font-bold text-gray-200">Dashboard</h1>
    <div class="mt-10 gap-10 flex flex-row justify-between items-center mb-10">
      <input
        type="text" 
        placeholder="Rechercher par 'Nom' et / ou 'Prenom' ..."
        class="border border-gray-600 bg-gray-800 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        id="search-box"
      />
      <button
        id='create-cv-btn'
        class="bg-indigo-500 hover:bg-indigo-700 whitespace-nowrap text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-4 focus:ring-indigo-300">
        + Create CV
      </button>
    </div>
		<ul id="cvs" class="flex flex-wrap gap-6 my-8 h-full min-h-96 justify-center items-center"></ul>
		<nav aria-label="Page navigation example" class="p-2 mx-24 m-4">
			<ul id="pagination" class="justify-content-center bg-zinc-800 rounded-full"></ul>
		</nav>
	</div>
	`;

  document.getElementById("create-cv-btn")?.addEventListener("click", () => {
    showFormPage();
  });

  document.getElementById("search-box")?.addEventListener("keyup", () => {
    pageNumber = 1;
    searchAndRenderUsers();
  });

  fetchAndRenderUsers();
}

async function searchAndRenderUsers() {
  const searchText = (document.getElementById("search-box") as HTMLInputElement)
    .value;
  //@ts-ignore
  if (!searchText || searchText === "") {
    pageNumber = 1;
    fetchAndRenderUsers();
    return;
  }

  try {
    const { users, total_count } = await SearchUsers(
      searchText,
      pageNumber,
      pageSize
    );
    renderUsers(users, searchAndRenderUsers);
    renderPagination(total_count, searchAndRenderUsers);
  } catch (err) {
    console.log(err);
    renderError(err as string);
  }
}

export async function fetchAndRenderUsers() {
  try {
    const { users, total_count } = await GetUsersPaginated(
      pageNumber,
      pageSize
    );
    renderUsers(users, fetchAndRenderUsers);
    renderPagination(total_count, fetchAndRenderUsers);
  } catch (err) {
    console.log(err);
    renderError(err as string);
  }
}

function renderUsers(users: main.User[], ondelete: () => {}) {
  const cvsDiv = document.getElementById("cvs") as HTMLDivElement;
  cvsDiv.innerHTML = "";
  if (!users || users.length === 0) {
    cvsDiv.innerText = "No CVs found.";
  } else {
    cvsDiv.innerHTML = `${users
      .map(
        (user) => `
					<li class="cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110">
            <div data-id="${
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
            </div>
        	</li>
					`
      )
      .join("")}`;
  }

  const lis = Array.from(document.querySelectorAll("#cvs > li"));
  lis.forEach((li) => {
    li.addEventListener("click", async () => {
      const userId = li.children[0].getAttribute("data-id");
      if (!userId) return;
      renderFloatingLoadingIndicator("Getting Profile");
      await showUpdateProfileForm(parseInt(userId));
      setTimeout(() => {
        closeFloatingLoadingIndicator();
      }, 2000);
    });
  });

  const deleteBtns = Array.from(document.getElementsByClassName("delete-btn"));
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const userId = btn.getAttribute("data-id");
      if (!userId || !confirm("Are you sure?")) return;
      try {
        await DeleteUser(parseInt(userId));
        ondelete();
      } catch (err) {
        console.error(err);
        renderError(err as string);
      }
    });
  });
}

function renderPagination(total_count: number, onchange: () => {}) {
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
      onchange();
    });
  });

  const prevBtn = document.querySelector(".prev-btn") as HTMLButtonElement;
  const nextBtn = document.querySelector(".next-btn") as HTMLButtonElement;
  prevBtn.addEventListener("click", () => {
    if (pageNumber <= 1) return;
    pageNumber--;
    onchange();
  });

  nextBtn.addEventListener("click", () => {
    if (pageNumber >= pagesCount) return;
    pageNumber++;
    onchange();
  });
}
