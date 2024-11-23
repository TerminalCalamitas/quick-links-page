let categories = JSON.parse(localStorage.getItem('categories')) || {
    "Favorites": [{
        "title": "Google",
        "url": "https://google.com"
    },
    {
        "title": "YouTube",
        "url": "https://youtube.com"
    }
    ],
    "Work": [{
        "title": "GitHub",
        "url": "https://github.com"
    }]
};

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function sortLinks(category) {
    categories[category].sort((a, b) => a.title.localeCompare(b.title));
    saveCategories();
    renderCategories();
}

function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categorySelect = document.getElementById('new-category');

    categoriesContainer.innerHTML = '';
    categorySelect.innerHTML = '<option value="" disabled selected>Select category</option>';

    for (const [category, links] of Object.entries(categories)) {
        const section = document.createElement('div');
        section.className = 'section';

        const header = document.createElement('div');
        header.className = 'section-header';

        const categoryTitle = document.createElement('span');
        categoryTitle.textContent = category;

        const categoryButtons = document.createElement('div');
        categoryButtons.className = 'category-buttons';

        const sortLinksButton = document.createElement('button');
        sortLinksButton.textContent = 'Sort Links';
        sortLinksButton.onclick = () => sortLinks(category);
        categoryButtons.appendChild(sortLinksButton);


        const editCategoryButton = document.createElement('button');
        editCategoryButton.textContent = 'Edit';
        editCategoryButton.onclick = (e) => {
            e.stopPropagation();
            const newCategoryName = prompt('Edit category name:', category);
            if (newCategoryName && newCategoryName !== category) {
                categories[newCategoryName] = categories[category]; // Copy links to new category
                delete categories[category]; // Delete old category
                saveCategories();
                renderCategories(); // Re-render after update
            }
        };

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.textContent = 'Delete';
        deleteCategoryButton.onclick = (e) => {
            e.stopPropagation();
            const confirmDelete = confirm(`Are you sure you want to delete the category "${category}"?`);
            if (confirmDelete) {
                delete categories[category];
                saveCategories();
                renderCategories(); // Re-render after delete
            }
        };

        categoryButtons.appendChild(editCategoryButton);
        categoryButtons.appendChild(deleteCategoryButton);
        header.appendChild(categoryTitle);
        header.appendChild(categoryButtons);

        const linksContainer = document.createElement('div');
        linksContainer.className = 'links';

        // Add collapse/expand functionality
        section.addEventListener('click', () => {
            const isCollapsed = linksContainer.classList.contains('expanded');
            linksContainer.classList.toggle('expanded', !isCollapsed);
            header.classList.toggle('collapsed', isCollapsed);
        });

        links.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'link-item';

            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.textContent = link.title;
            anchor.target = '_blank';
            linkItem.appendChild(anchor);

            const linkButtons = document.createElement('div');
            linkButtons.className = 'link-buttons';

            const editLinkButton = document.createElement('button');
            editLinkButton.textContent = 'Edit';
            editLinkButton.onclick = (e) => {
                e.stopPropagation();
                const newTitle = prompt('Edit link title:', link.title);
                const newURL = prompt('Edit link URL:', link.url);
                if (newTitle && newURL) {
                    categories[category][index] = {
                        title: newTitle,
                      url: newURL
                    };
                    saveCategories();
                    renderCategories();
                }
            };

            const deleteLinkButton = document.createElement('button');
            deleteLinkButton.textContent = 'Delete';
            deleteLinkButton.onclick = (e) => {
                e.stopPropagation();
                deleteLink(category, index);
            };

            linkButtons.appendChild(editLinkButton);
            linkButtons.appendChild(deleteLinkButton);
            linkItem.appendChild(linkButtons);
            linksContainer.appendChild(linkItem);
        });

        section.appendChild(header);
        section.appendChild(linksContainer);
        categoriesContainer.appendChild(section);

        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    }
}


function deleteCategory(category) {
    delete categories[category];
    saveCategories();
    renderCategories();
}

function addCategory() {
    const categoryName = document.getElementById('new-category-name').value.trim() || 'Unnamed';
    if (categoryName && !categories[categoryName]) {
        categories[categoryName] = [];
        saveCategories();
        renderCategories();
    }
    document.getElementById('new-category-name').value = '';
}

function addLink() {
    const url = document.getElementById('new-url').value.trim() || 'www.example.com';
    const title = document.getElementById('new-title').value.trim() || url;
    const category = document.getElementById('new-category').value;

    if (title && url && category) {
        categories[category].push({
            title,
            url
        });
        saveCategories();
        renderCategories();
    }

    document.getElementById('new-title').value = '';
    document.getElementById('new-url').value = '';
    document.getElementById('new-category').value = '';
}

function deleteLink(category, index) {
    categories[category].splice(index, 1);
    saveCategories();
    renderCategories();
}

function filterLinks() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    for (const section of document.querySelectorAll('.section')) {
        const links = section.querySelectorAll('.link-item');
        let hasVisibleLink = false;

        links.forEach(link => {
            const text = link.querySelector('a').textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            link.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) hasVisibleLink = true;
        });

            section.style.display = hasVisibleLink ? 'block' : 'none';
    }
}

function exportToJSON() {
    const blob = new Blob([JSON.stringify(categories, null, 2)], {
        type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'links.json';
    link.click();
}

function importFromJSON() {
    const fileInput = document.getElementById('import-json');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            categories = data;
            saveCategories();
            renderCategories();
        };
        reader.readAsText(file);
    }
}

const root = document.documentElement;
let themes = {
    default: {
        "--bg": "#1e1e2e",
        "--fg": "#f5c2e7",
        "--accent": "#f5c2e7",
        "--section-bg": "#313244",
        "--button-bg": "#45475a",
        "--input-bg": "#313244",
        "--border": "#585b70",
        "--link-hover": "#cba6f7",
        "--shadow": "rgba(0, 0, 0, 0.25)"
    },
    tokyodark: {
        "--bg": "#11121d",
        "--fg": "#a9b1d6",
        "--accent": "#7aa2f7",
        "--section-bg": "#21222c",
        "--button-bg": "#444b6a",
        "--input-bg": "#21222c",
        "--border": "#444b6a",
        "--link-hover": "#9ece6a",
        "--shadow": "rgba(0, 0, 0, 0.4)"
    },
    gruvbox: {
        "--bg": "#282828",
        "--fg": "#ebdbb2",
        "--accent": "#fe8019",
        "--section-bg": "#3c3836",
        "--button-bg": "#504945",
        "--input-bg": "#3c3836",
        "--border": "#665c54",
        "--link-hover": "#fabd2f",
        "--shadow": "rgba(0, 0, 0, 0.3)"
    }
};

// Load saved themes
themes = JSON.parse(localStorage.getItem("themes")) || themes;

function applyTheme(themeName) {
    const theme = themes[themeName];
    if (theme) {
        for (const [key, value] of Object.entries(theme)) {
            root.style.setProperty(key, value);
        }
        localStorage.setItem("selectedTheme", themeName);
    }
}

function toggleThemeEditor() {
    document.getElementById("theme-editor").style.display = "block";
    updateDeleteThemeDropdown();
}

function closeThemeEditor() {
    document.getElementById("theme-editor").style.display = "none";
}

function saveTheme() {
    const name = document.getElementById("theme-name").value.trim();
    const vars = document.getElementById("theme-vars").value.trim();

    if (name && vars) {
        const parsedVars = {};
        vars.split("\n").forEach(line => {
            const [key, value] = line.split(":").map(s => s.trim());
            if (key && value) {
                parsedVars[key] = value.replace(";", "");
            }
        });

        themes[name] = parsedVars;
        localStorage.setItem("themes", JSON.stringify(themes));

        // Update the theme selector
        const selector = document.getElementById("theme");
        if (!Array.from(selector.options).find(option => option.value === name)) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            selector.appendChild(option);
        }

        alert(`Theme "${name}" saved successfully!`);
        closeThemeEditor();
    }
}

function importThemes() {
    document.getElementById("import-file").click();
}

function loadThemesFromFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const importedThemes = JSON.parse(e.target.result);
            themes = {
                ...themes,
                ...importedThemes
            };
            localStorage.setItem("themes", JSON.stringify(themes));
            alert("Themes imported successfully!");
            updateDeleteThemeDropdown();
        };
        reader.readAsText(file);
    }
}

function exportThemes() {
    const blob = new Blob([JSON.stringify(themes, null, 2)], {
        type: "application/json"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "themes.json";
    link.click();
}

function toggleDeleteTheme() {
    const deleteDropdown = document.getElementById("delete-theme");
    deleteDropdown.style.display = deleteDropdown.style.display === "none" ? "block" : "none";
}

function deleteTheme(themeName) {
    if (themeName && confirm(`Are you sure you want to delete the theme "${themeName}"?`)) {
        delete themes[themeName];
        localStorage.setItem("themes", JSON.stringify(themes));
        document.getElementById("theme").querySelector(`option[value="${themeName}"]`).remove();
        updateDeleteThemeDropdown();
        alert(`Theme "${themeName}" deleted successfully!`);
    }
}

function updateDeleteThemeDropdown() {
    const deleteDropdown = document.getElementById("delete-theme");
    deleteDropdown.innerHTML = '<option value="" disabled selected>Delete a Theme</option>';
    for (const theme in themes) {
        if (theme !== "default") {
            const option = document.createElement("option");
            option.value = theme;
            option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
            deleteDropdown.appendChild(option);
        }
    }
}

// Initialize themes
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme") || "default";
    document.getElementById("theme").value = savedTheme;
    applyTheme(savedTheme);
});

// Initialize with default categories if none exist
if (!localStorage.getItem('categories')) {
    saveCategories();
}

renderCategories();
