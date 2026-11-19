
// ======================================================
// SNAPBOOK ADMIN DASHBOARD
// Bookings + Customers + Charts + Package Management
// Local Storage + Chart.js
// ======================================================

const BOOKING_KEY = "snapbookBookings";
const CUSTOMER_KEY = "snapbookCustomers";
const PACKAGE_KEY = "snapbookPackages";
const DEMO_SEED_KEY = "snapbookDemoBookingsSeededV2";

// ======================================================
// 1. GLOBAL VARIABLES
// ======================================================

let bookings = [];
let customers = [];
let packages = [];

const dashboardCharts = {};

let packageModal = null;
let selectedPackageImage = "";

// ======================================================
// 2. LOCAL STORAGE FUNCTIONS
// ======================================================

function readArray(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Storage error:", error);
        return [];
    }
}

function saveArray(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// ======================================================
// 3. DEFAULT PACKAGES
// ======================================================

const defaultPackages = [
    {
        id: "PKG001",
        name: "Wedding Session",
        price: 800,
        description: "Capture your special moments with a professional wedding photography session.",
        status: "Active",
        image: "wedding1.jpg"
    },
    {
        id: "PKG002",
        name: "Graduation Session",
        price: 300,
        description: "Celebrate your academic achievement with a memorable graduation photoshoot.",
        status: "Active",
        image: "graduation1.jpg"
    }
];

function initializePackages() {
    const savedPackages = readArray(PACKAGE_KEY);

    if (savedPackages.length === 0) {
        packages = [...defaultPackages];
    } else {
        packages = savedPackages.map(item => {
            const defaultPackage = defaultPackages.find(
                pkg => pkg.id === item.id
            );

            return {
                ...item,
                image: item.image || defaultPackage?.image || ""
            };
        });
    }

    saveArray(PACKAGE_KEY, packages);
}

// ======================================================
// 4. DEMO BOOKING DATA
// ======================================================

function getDateByMonthOffset(monthOffset, day) {
    const today = new Date();

    const date = new Date(
        today.getFullYear(),
        today.getMonth() + monthOffset,
        1
    );

    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    date.setDate(Math.min(day, lastDay));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateDay = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${dateDay}`;
}

function seedDemoBookings() {
    if (localStorage.getItem(DEMO_SEED_KEY) === "true") {
        return;
    }

    const demoBookings = [
        {
            id: "DEMO001",
            username: "aisha01",
            fullName: "Aisha Rahman",
            email: "aisha@example.com",
            package: "Wedding Session",
            date: getDateByMonthOffset(-5, 12),
            time: "10 AM",
            notes: "Wedding outdoor photography",
            status: "Completed"
        },
        {
            id: "DEMO002",
            username: "daniel02",
            fullName: "Daniel Tan",
            email: "daniel@example.com",
            package: "Graduation Session",
            date: getDateByMonthOffset(-5, 20),
            time: "2 PM",
            notes: "Graduation photoshoot",
            status: "Completed"
        },
        {
            id: "DEMO003",
            username: "nurul03",
            fullName: "Nurul Izzah",
            email: "nurul@example.com",
            package: "Wedding Session",
            date: getDateByMonthOffset(-4, 8),
            time: "12 PM",
            notes: "Wedding ceremony",
            status: "Completed"
        },
        {
            id: "DEMO004",
            username: "amir04",
            fullName: "Amir Hakim",
            email: "amir@example.com",
            package: "Graduation Session",
            date: getDateByMonthOffset(-4, 18),
            time: "4 PM",
            notes: "Individual graduation portrait",
            status: "Completed"
        },
        {
            id: "DEMO005",
            username: "sofia05",
            fullName: "Sofia Lim",
            email: "sofia@example.com",
            package: "Wedding Session",
            date: getDateByMonthOffset(-3, 10),
            time: "10 AM",
            notes: "Wedding couple session",
            status: "Completed"
        },
        {
            id: "DEMO006",
            username: "haziq06",
            fullName: "Haziq Ahmad",
            email: "haziq@example.com",
            package: "Graduation Session",
            date: getDateByMonthOffset(-3, 22),
            time: "2 PM",
            notes: "Graduation with family",
            status: "Completed"
        },
        {
            id: "DEMO007",
            username: "emily07",
            fullName: "Emily Wong",
            email: "emily@example.com",
            package: "Wedding Session",
            date: getDateByMonthOffset(-2, 14),
            time: "12 PM",
            notes: "Wedding photography",
            status: "Completed"
        },
        {
            id: "DEMO008",
            username: "farah08",
            fullName: "Farah Nadia",
            email: "farah@example.com",
            package: "Graduation Session",
            date: getDateByMonthOffset(-2, 25),
            time: "4 PM",
            notes: "Graduation portrait session",
            status: "Completed"
        },
        {
            id: "DEMO009",
            username: "aisha01",
            fullName: "Aisha Rahman",
            email: "aisha@example.com",
            package: "Wedding Session",
            date: getDateByMonthOffset(-1, 16),
            time: "10 AM",
            notes: "Additional wedding session",
            status: "Confirmed"
        },
        {
            id: "DEMO010",
            username: "daniel02",
            fullName: "Daniel Tan",
            email: "daniel@example.com",
            package: "Graduation Session",
            date: getDateByMonthOffset(-1, 24),
            time: "2 PM",
            notes: "Graduation photos",
            status: "Confirmed"
        },
        {
            id: "DEMO011",
            username: "customer09",
            fullName: "Customer Demo",
            email: "customer@example.com",
            package: "Wedding Session",
            date: getDateByMonthOffset(0, 25),
            time: "12 PM",
            notes: "Upcoming wedding session",
            status: "Pending"
        },
        {
            id: "DEMO012",
            username: "customer10",
            fullName: "Sarah Lee",
            email: "sarah@example.com",
            package: "Graduation Session",
            date: getDateByMonthOffset(0, 27),
            time: "4 PM",
            notes: "Upcoming graduation session",
            status: "Pending"
        },
        {
            id: "DEMO013",
            username: "customer11",
            fullName: "Adam Firdaus",
            email: "adam@example.com",
            package: "Wedding Session",
            date: getDateByMonthOffset(-1, 8),
            time: "10 AM",
            notes: "Booking cancelled by customer",
            status: "Cancelled"
        },
        {
            id: "DEMO014",
            username: "customer12",
            fullName: "Mira Azman",
            email: "mira@example.com",
            package: "Graduation Session",
            date: getDateByMonthOffset(0, 29),
            time: "2 PM",
            notes: "Waiting for confirmation",
            status: "Pending"
        }
    ];

    const existingBookings = readArray(BOOKING_KEY);

    const existingIds = new Set(
        existingBookings.map(booking => booking.id)
    );

    const newDemoBookings = demoBookings.filter(
        booking => !existingIds.has(booking.id)
    );

    saveArray(
        BOOKING_KEY,
        [...existingBookings, ...newDemoBookings]
    );

    localStorage.setItem(DEMO_SEED_KEY, "true");
}

// ======================================================
// 5. BOOKING STATUS AND DATE FUNCTIONS
// ======================================================

function getStatus(booking) {
    const status = String(
        booking.status || "Pending"
    ).toLowerCase();

    if (status === "completed") return "Completed";
    if (status === "confirmed") return "Confirmed";

    if (
        status === "cancelled" ||
        status === "rejected"
    ) {
        return "Cancelled";
    }

    return "Pending";
}

function statusBadge(status) {
    const normalized = getStatus({ status });

    const classes = {
        Completed: "badge-completed",
        Confirmed: "badge-confirmed",
        Pending: "badge-pending",
        Cancelled: "badge-rejected"
    };

    return `
        <span class="badge ${classes[normalized] || "badge-pending"}">
            ${escapeHTML(normalized)}
        </span>
    `;
}

function parseBookingDate(value) {
    if (!value) return null;

    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));

    if (match) {
        const date = new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
        );

        return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
    const date = parseBookingDate(value);

    if (!date) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getCustomerName(booking) {
    if (booking.fullName) return booking.fullName;

    const customer = customers.find(item =>
        item.username === booking.username
    );

    return customer?.fullName ||
        customer?.name ||
        booking.username ||
        "Customer";
}

// ======================================================
// 6. CUSTOMER DATA
// ======================================================

function getAllCustomers() {
    const registeredCustomers = readArray(CUSTOMER_KEY);
    const customerMap = new Map();

    registeredCustomers.forEach(customer => {
        const username = customer.username || "";
        const email = customer.email || "";
        const name = customer.fullName || customer.name || username;

        const key = username || email || name;

        if (!key) return;

        customerMap.set(String(key).toLowerCase(), {
            fullName: name || "Customer",
            username: username,
            email: email,
            totalBookings: 0
        });
    });

    bookings.forEach(booking => {
        const username = booking.username || "";
        const email = booking.email || "";
        const name = booking.fullName || booking.name || username;

        const key = username || email || name;

        if (!key) return;

        const normalizedKey = String(key).toLowerCase();

        if (!customerMap.has(normalizedKey)) {
            customerMap.set(normalizedKey, {
                fullName: name || "Customer",
                username: username,
                email: email,
                totalBookings: 0
            });
        }

        const customer = customerMap.get(normalizedKey);

        if (!customer.email && email) {
            customer.email = email;
        }

        customer.totalBookings++;
    });

    return Array.from(customerMap.values());
}

// ======================================================
// 7. RENDER STATISTICS
// ======================================================

function renderStatistics() {
    const totalBookings = document.getElementById("totalBookings");
    const pendingBookings = document.getElementById("pendingBookings");
    const totalCustomers = document.getElementById("totalCustomers");
    const availablePackages = document.getElementById("availablePackages");

    if (totalBookings) {
        totalBookings.textContent = bookings.length;
    }

    if (pendingBookings) {
        pendingBookings.textContent = bookings.filter(
            booking => getStatus(booking) === "Pending"
        ).length;
    }

    if (totalCustomers) {
        totalCustomers.textContent = customers.length;
    }

    if (availablePackages) {
        availablePackages.textContent = packages.filter(
            item => item.status === "Active"
        ).length;
    }
}

// ======================================================
// 8. RENDER RECENT BOOKINGS
// ======================================================

function renderRecentBookings() {
    const tableBody = document.getElementById("recentRows");

    if (!tableBody) return;

    const sorted = [...bookings].sort((a, b) => {
        const dateA = parseBookingDate(a.date);
        const dateB = parseBookingDate(b.date);

        return (dateB?.getTime() || 0) -
            (dateA?.getTime() || 0);
    });

    const recent = sorted.slice(0, 4);

    tableBody.innerHTML = recent.map(booking => `
        <tr>
            <td>${escapeHTML(getCustomerName(booking))}</td>
            <td>${escapeHTML(booking.package || "—")}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${statusBadge(getStatus(booking))}</td>
        </tr>
    `).join("") || `
        <tr>
            <td colspan="4" class="text-center py-4">
                No bookings available.
            </td>
        </tr>
    `;
}

// ======================================================
// 9. RENDER ALL BOOKINGS
// ======================================================

function renderAllBookings() {
    const tableBody = document.getElementById("allBookingRows");

    if (!tableBody) return;

    const sorted = [...bookings].sort((a, b) => {
        const dateA = parseBookingDate(a.date);
        const dateB = parseBookingDate(b.date);

        return (dateB?.getTime() || 0) -
            (dateA?.getTime() || 0);
    });

    tableBody.innerHTML = sorted.map(booking => {
        const status = getStatus(booking);

        return `
            <tr>
                <td>${escapeHTML(getCustomerName(booking))}</td>
                <td>${escapeHTML(booking.package || "—")}</td>
                <td>${formatDate(booking.date)}</td>
                <td>${escapeHTML(booking.time || "—")}</td>
                <td>${statusBadge(status)}</td>
                <td>
                    <select
                        class="form-select form-select-sm status-select"
                        data-booking-id="${escapeHTML(booking.id)}"
                        aria-label="Update booking status">

                        <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Confirmed" ${status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                        <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
                        <option value="Cancelled" ${status === "Cancelled" ? "selected" : ""}>Cancelled</option>

                    </select>
                </td>
            </tr>
        `;
    }).join("") || `
        <tr>
            <td colspan="6" class="text-center py-4">
                No bookings available.
            </td>
        </tr>
    `;
}

// ======================================================
// 10. RENDER CUSTOMERS
// ======================================================

function renderCustomers() {
    const tableBody = document.getElementById("customerRows");

    if (!tableBody) return;

    tableBody.innerHTML = customers.map(customer => `
        <tr>
            <td>${escapeHTML(customer.fullName)}</td>
            <td>${escapeHTML(customer.username || "—")}</td>
            <td>${escapeHTML(customer.email || "—")}</td>
        </tr>
    `).join("") || `
        <tr>
            <td colspan="3" class="text-center py-4">
                No customers available.
            </td>
        </tr>
    `;
}

// ======================================================
// 11. PACKAGE MANAGEMENT
// ======================================================

function renderPackages() {
    const tableBody = document.getElementById("packageRows");

    if (!tableBody) return;

    tableBody.innerHTML = packages.map(item => {
        const imageHTML = item.image
            ? `
                <img
                    src="${escapeHTML(item.image)}"
                    alt="${escapeHTML(item.name)}"
                    onerror="this.onerror=null;this.src='${item.id === "PKG002" ? "graduation1.jpg" : "wedding1.jpg"}';"
                    style="width:75px;height:55px;object-fit:cover;border-radius:8px;">
              `
            : `<span class="text-muted small">No image</span>`;

        const statusClass = item.status === "Active"
            ? "bg-success-subtle text-success"
            : "bg-secondary-subtle text-secondary";

        return `
            <tr>
                <td>
                    <strong>${escapeHTML(item.name)}</strong>
                </td>

                <td>${imageHTML}</td>

                <td style="min-width:220px;max-width:300px;">
                    <span class="small text-muted">
                        ${escapeHTML(item.description)}
                    </span>
                </td>

                <td>
                    <strong>RM ${Number(item.price).toFixed(2)}</strong>
                </td>

                <td>
                    <span class="badge ${statusClass}">
                        ${escapeHTML(item.status)}
                    </span>
                </td>

                <td>
                    <button
                        type="button"
                        class="btn btn-sm btn-outline-dark edit-package-btn"
                        data-package-id="${escapeHTML(item.id)}">
                        Edit
                    </button>
                </td>
            </tr>
        `;
    }).join("") || `
        <tr>
            <td colspan="6" class="text-center py-4">
                No packages available.
            </td>
        </tr>
    `;
}

function savePackages() {
    saveArray(PACKAGE_KEY, packages);
    renderPackages();
    renderStatistics();
    renderCharts();
}

function resetPackageForm() {
    const form = document.getElementById("packageForm");

    if (!form) return;

    form.reset();

    document.getElementById("packageId").value = "";
    document.getElementById("packageModalTitle").textContent = "Add New Package";
    document.getElementById("savePackageBtn").textContent = "Save Package";

    document.getElementById("packageFeedback").textContent = "";

    selectedPackageImage = "";

    const preview = document.getElementById("packageImagePreview");
    const placeholder = document.getElementById("packageImagePlaceholder");

    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }

    if (placeholder) {
        placeholder.style.display = "block";
    }
}

function showImagePreview(imageSource) {
    const preview = document.getElementById("packageImagePreview");
    const placeholder = document.getElementById("packageImagePlaceholder");

    if (!preview || !placeholder) return;

    if (imageSource) {
        preview.src = imageSource;
        preview.style.display = "block";
        placeholder.style.display = "none";
    } else {
        preview.src = "";
        preview.style.display = "none";
        placeholder.style.display = "block";
    }
}

function openAddPackageModal() {
    resetPackageForm();

    document.getElementById("packageModalTitle").textContent = "Add New Package";

    if (packageModal) {
        packageModal.show();
    }
}

function openEditPackageModal(packageId) {
    const item = packages.find(pkg => pkg.id === packageId);

    if (!item) return;

    resetPackageForm();

    document.getElementById("packageModalTitle").textContent = "Edit Package";
    document.getElementById("savePackageBtn").textContent = "Update Package";

    document.getElementById("packageId").value = item.id;
    document.getElementById("packageName").value = item.name;
    document.getElementById("packagePrice").value = item.price;
    document.getElementById("packageDescription").value = item.description;
    document.getElementById("packageStatus").value = item.status;

    selectedPackageImage = item.image || "";

    showImagePreview(selectedPackageImage);

    if (packageModal) {
        packageModal.show();
    }
}

function handlePackageImage(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        event.target.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be 2 MB or smaller.");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        selectedPackageImage = e.target.result;
        showImagePreview(selectedPackageImage);
    };

    reader.readAsDataURL(file);
}

function handlePackageSubmit(event) {
    event.preventDefault();

    const id = document.getElementById("packageId").value;
    const name = document.getElementById("packageName").value.trim();
    const price = Number(document.getElementById("packagePrice").value);
    const description = document.getElementById("packageDescription").value.trim();
    const status = document.getElementById("packageStatus").value;

    const feedback = document.getElementById("packageFeedback");

    if (!name || !description || !Number.isFinite(price) || price < 0) {
        feedback.textContent = "Please enter valid package details.";
        feedback.className = "small text-danger";
        return;
    }

    const duplicate = packages.some(item =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.id !== id
    );

    if (duplicate) {
        feedback.textContent = "A package with this name already exists.";
        feedback.className = "small text-danger";
        return;
    }

    if (id) {
        const index = packages.findIndex(item => item.id === id);

        if (index === -1) return;

        packages[index] = {
            ...packages[index],
            name,
            price,
            description,
            status,
            image: selectedPackageImage || packages[index].image || ""
        };

    } else {
        const newPackage = {
            id: "PKG-" + Date.now(),
            name,
            price,
            description,
            status,
            image: selectedPackageImage || ""
        };

        packages.push(newPackage);
    }

    try {
        savePackages();

        if (packageModal) {
            packageModal.hide();
        }

    } catch (error) {
        console.error("Package save error:", error);

        feedback.textContent = "Unable to save. Image may be too large for browser storage.";
        feedback.className = "small text-danger";
    }
}

// ======================================================
// 12. CHART.JS
// ======================================================

function createOrUpdateChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);

    if (!canvas || typeof Chart === "undefined") return;

    if (dashboardCharts[canvasId]) {
        dashboardCharts[canvasId].data = config.data;
        dashboardCharts[canvasId].options = config.options;
        dashboardCharts[canvasId].update();
    } else {
        dashboardCharts[canvasId] = new Chart(canvas, config);
    }
}

function getLastSixMonths() {
    const result = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(
            today.getFullYear(),
            today.getMonth() - i,
            1
        );

        result.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            label: date.toLocaleDateString("en-US", {
                month: "short"
            })
        });
    }

    return result;
}

function renderCharts() {
    if (typeof Chart === "undefined") return;

    const months = getLastSixMonths();

    const monthlyCounts = months.map(month =>
        bookings.filter(booking => {
            const date = parseBookingDate(booking.date);

            return date &&
                date.getFullYear() === month.year &&
                date.getMonth() === month.month;
        }).length
    );

    // Booking activity

    createOrUpdateChart("bookingChart", {
        type: "bar",
        data: {
            labels: months.map(item => item.label),
            datasets: [{
                label: "Bookings",
                data: monthlyCounts,
                backgroundColor: "#bd965c",
                borderRadius: 7,
                maxBarThickness: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });

    // Popular Packages

    const activePackageNames = packages.map(item => item.name);

    const packageCounts = activePackageNames.map(name =>
        bookings.filter(booking =>
            booking.package === name
        ).length
    );

    const palette = [
        "#bd965c",
        "#343d37",
        "#dfc49c",
        "#82977e",
        "#9b8aab",
        "#c87575"
    ];

    createOrUpdateChart("packageChart", {
        type: "doughnut",
        data: {
            labels: activePackageNames.length
                ? activePackageNames
                : ["No packages"],

            datasets: [{
                data: activePackageNames.length
                    ? packageCounts
                    : [1],

                backgroundColor: activePackageNames.length
                    ? activePackageNames.map((_, index) =>
                        palette[index % palette.length]
                    )
                    : ["#e9e5dd"],

                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        padding: 18
                    }
                }
            },
            cutout: "65%"
        }
    });

    // Yearly report

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    const currentYear = new Date().getFullYear();

    const yearlyCounts = monthNames.map((_, month) =>
        bookings.filter(booking => {
            const date = parseBookingDate(booking.date);

            return date &&
                date.getFullYear() === currentYear &&
                date.getMonth() === month;
        }).length
    );

    createOrUpdateChart("reportChart", {
        type: "line",
        data: {
            labels: monthNames,
            datasets: [{
                label: "Bookings",
                data: yearlyCounts,
                borderColor: "#a77d43",
                backgroundColor: "rgba(185,145,88,.15)",
                fill: true,
                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });

    // Booking status

    const statuses = [
        "Completed",
        "Confirmed",
        "Pending",
        "Cancelled"
    ];

    const statusCounts = statuses.map(status =>
        bookings.filter(booking =>
            getStatus(booking) === status
        ).length
    );

    createOrUpdateChart("statusChart", {
        type: "pie",
        data: {
            labels: statuses,
            datasets: [{
                data: statusCounts,
                backgroundColor: [
                    "#6b9b7a",
                    "#6c8ebf",
                    "#d9ae62",
                    "#c87575"
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        padding: 16
                    }
                }
            }
        }
    });
}

// ======================================================
// 13. REMOVE UNWANTED CUSTOMERS
// ======================================================

function removeUnwantedUsers() {
    const unwantedUsernames = ["fiqz", "c"];

    // Remove customer records

    const savedCustomers = readArray(CUSTOMER_KEY);

    const cleanCustomers = savedCustomers.filter(customer => {
        const username = String(customer.username || "")
            .trim()
            .toLowerCase();

        return !unwantedUsernames.includes(username);
    });

    if (cleanCustomers.length !== savedCustomers.length) {
        saveArray(CUSTOMER_KEY, cleanCustomers);
    }

    // Remove their booking records

    const savedBookings = readArray(BOOKING_KEY);

    const cleanBookings = savedBookings.filter(booking => {
        const username = String(booking.username || "")
            .trim()
            .toLowerCase();

        return !unwantedUsernames.includes(username);
    });

    if (cleanBookings.length !== savedBookings.length) {
        saveArray(BOOKING_KEY, cleanBookings);
    }
}

// ======================================================
// 14. REFRESH DASHBOARD
// ======================================================

function refreshDashboard() {

    // Automatically remove unwanted users
    removeUnwantedUsers();

    bookings = readArray(BOOKING_KEY);

    let changed = false;

    bookings.forEach((booking, index) => {
        if (!booking.id) {
            booking.id = `BOOKING-${Date.now()}-${index}`;
            changed = true;
        }
    });

    if (changed) {
        saveArray(BOOKING_KEY, bookings);
    }

    customers = getAllCustomers();
    packages = readArray(PACKAGE_KEY);

    renderStatistics();
    renderRecentBookings();
    renderAllBookings();
    renderCustomers();
    renderPackages();
    renderCharts();
}

// ======================================================
// 15. UPDATE BOOKING STATUS
// ======================================================

document.addEventListener("change", event => {
    if (!event.target.matches(".status-select")) return;

    const bookingId = event.target.dataset.bookingId;
    const newStatus = event.target.value;

    const latestBookings = readArray(BOOKING_KEY);

    const booking = latestBookings.find(item =>
        String(item.id) === String(bookingId)
    );

    if (!booking) return;

    booking.status = newStatus;

    saveArray(BOOKING_KEY, latestBookings);

    refreshDashboard();
});

// ======================================================
// 16. PACKAGE EVENT LISTENERS
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    const modalElement = document.getElementById("packageModal");

    if (modalElement && typeof bootstrap !== "undefined") {
        packageModal = new bootstrap.Modal(modalElement);
    }

    const addButton = document.getElementById("addPackageBtn");

    if (addButton) {
        addButton.addEventListener("click", openAddPackageModal);
    }

    const packageForm = document.getElementById("packageForm");

    if (packageForm) {
        packageForm.addEventListener("submit", handlePackageSubmit);
    }

    const imageInput = document.getElementById("packageImage");

    if (imageInput) {
        imageInput.addEventListener("change", handlePackageImage);
    }

    const packageRows = document.getElementById("packageRows");

    if (packageRows) {
        packageRows.addEventListener("click", event => {
            const button = event.target.closest(".edit-package-btn");

            if (!button) return;

            openEditPackageModal(button.dataset.packageId);
        });
    }

    if (modalElement) {
        modalElement.addEventListener("hidden.bs.modal", resetPackageForm);
    }
});

// ======================================================
// 17. SINGLE PAGE NAVIGATION
// ======================================================

function showPage(pageId) {
    const target = document.getElementById(pageId);

    if (!target) return;

    document.querySelectorAll(".nav-link[data-page]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.page === pageId
        );
    });

    target.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    if (pageId === "reports") {
        setTimeout(() => {
            Object.values(dashboardCharts).forEach(chart => chart.resize());
        }, 350);
    }
}

document.querySelectorAll("[data-page]").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });
});

// ======================================================
// 18. LOGOUT
// ======================================================

const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {
    logoutLink.addEventListener("click", () => {
        localStorage.removeItem("snapbookCurrentUser");
    });
}

// ======================================================
// 19. AUTOMATIC REFRESH
// ======================================================

window.addEventListener("storage", event => {
    if (
        event.key === BOOKING_KEY ||
        event.key === CUSTOMER_KEY ||
        event.key === PACKAGE_KEY
    ) {
        refreshDashboard();
    }
});

window.addEventListener("focus", refreshDashboard);

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        refreshDashboard();
    }
});

// ======================================================
// 20. INITIALIZE DASHBOARD
// ======================================================

initializePackages();
seedDemoBookings();
refreshDashboard();
