// Hàm tạo bảng ma trận dựa trên số phòng
function generateMatrix() {
    document.getElementById('matrixTitle').style.display = 'block';
    const numRooms = parseInt(document.getElementById('numRooms').value);
    const table = document.getElementById('matrix');
    table.innerHTML = ''; // Xóa bảng cũ

    // Khởi tạo mảng values để lưu trữ giá trị
    const values = Array.from({ length: numRooms + 1 }, () => Array(numRooms + 1).fill(0));

    for (let i = 0; i <= numRooms; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j <= numRooms; j++) {
            const cell = document.createElement(i == 0 || j == 0 ? 'th' : 'td');
            if (i == 0 && j == 0) {
                cell.innerText = 'Khoảng cách';
            } else if (i == 0 && j > 0) {
                cell.innerText = 'P' + j; // Đặt tiêu đề cột
            } else if (j == 0 && i > 0) {
                cell.innerText = 'P' + i; // Đặt tiêu đề hàng
            } else if (i > 0 && j > 0 && i < j) {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                const randomValue = Math.floor(Math.random() * 100);
                input.value = randomValue; // Gán giá trị ngẫu nhiên
                values[i][j] = randomValue; // Lưu giá trị vào mảng
                cell.appendChild(input);
            } else if (i > 0 && j > 0 && i > j) {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.value = values[j][i]; // Gán giá trị Aji từ mảng
                cell.appendChild(input);
            } else {
                const input = document.createElement('input');
                input.value = '0'; // Gán 0 cho ô (i, i)
                cell.appendChild(input);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}
// Hàm tìm cây khung nhỏ nhất bằng Kruskal
//cach 1
function kruskalMST() {
    const numRooms = parseInt(document.getElementById('numRooms').value);
    const edges = [];
    const graph = Array(numRooms).fill(null).map(() => []); // Khởi tạo đồ thị
    const result = [];
    let totalLength = 0;

    // Lấy ma trận từ bảng HTML
    const matrix = [];
    for (let i = 1; i <= numRooms; i++) {
        matrix[i - 1] = [];
        for (let j = 1; j <= numRooms; j++) {
            const value = parseInt(document.querySelector(`#matrix tr:nth-child(${i + 1}) td:nth-child(${j + 1}) input`).value);
            matrix[i - 1][j - 1] = value;
            if (i < j && value > 0) {
                edges.push([value, i - 1, j - 1]); // Lưu cạnh dưới dạng [trọng số, đỉnh 1, đỉnh 2]
            }
        }
    }

    // Sắp xếp các cạnh theo trọng số
    edges.sort((a, b) => a[0] - b[0]);

    // Hiển thị bảng sắp xếp các cạnh
    const sortedEdgesTable = document.querySelector("#sortedEdges tbody");
    sortedEdgesTable.innerHTML = ''; // Xóa bảng cũ
    document.getElementById('sortedEdges').style.display = 'table';
    document.getElementById('sortedEdgesTitle').style.display = 'block';
    document.getElementById('primEdges').style.display = 'none';
    document.getElementById('primEdgesTitle').style.display = 'none';

    // Hàm DFS kiểm tra chu trình
    function hasCycle(u, parent, visited) {
        visited[u] = true;
        for (let neighbor of graph[u]) {
            if (!visited[neighbor]) {
                if (hasCycle(neighbor, u, visited)) {
                    return true;
                }
            } else if (neighbor !== parent) {
                return true;
            }
        }
        return false;
    }

    // Bắt đầu thuật toán Kruskal
    const stepsDiv = document.getElementById('steps');
    stepsDiv.innerHTML = ''; // Xóa các bước cũ
    document.querySelector('.steps').classList.remove('hidden');

    let edgesAdded = 0; // Biến đếm số cạnh đã thêm vào MST

    edges.forEach(([weight, u, v]) => {
        const visited = Array(numRooms).fill(false);
        graph[u].push(v);
        graph[v].push(u);

        const cycleFormed = hasCycle(u, -1, visited); // Kiểm tra chu trình bằng DFS

        // Nếu có chu trình thì loại bỏ cạnh này khỏi đồ thị
        if (cycleFormed) {
            graph[u].pop();
            graph[v].pop();
        }

        // Cập nhật bảng sortedEdges
        const row = document.createElement('tr');
        row.innerHTML = `<td>P${u + 1}</td><td>P${v + 1}</td><td>${weight}</td><td>${cycleFormed ? 'Có' : 'Không'}</td>`;
        sortedEdgesTable.appendChild(row);

        if (!cycleFormed) {
            result.push([u + 1, v + 1, weight]);
            totalLength += weight;
            edgesAdded++; // Tăng số lượng cạnh đã thêm

            // In bước thực hiện
            const step = document.createElement('p');
            step.innerText = `Thêm dây giữa phòng P${u + 1} và P${v + 1} với độ dài ${weight}. Tổng độ dài dây điện là: ${totalLength}`;
            stepsDiv.appendChild(step);
        } else if (edgesAdded < numRooms - 1) {
            // In bước bỏ qua cạnh chỉ khi chưa đạt đủ số cạnh
            const step = document.createElement('p');
            step.innerText = `Bỏ qua dây giữa phòng P${u + 1} và P${v + 1} vì nó tạo thành chu trình.`;
            stepsDiv.appendChild(step);
        }
    });

    // In kết quả cuối cùng
    const finalStep = document.createElement('p');
    finalStep.innerText = `Cây khung nhỏ nhất có tổng độ dài dây điện là: ${totalLength}`;
    stepsDiv.appendChild(finalStep);
}

// cach 2
// function kruskalMST() {
//     const numRooms = parseInt(document.getElementById('numRooms').value);
//     const edges = [];
//     const parent = Array(numRooms).fill(0).map((_, i) => i);
//     const result = [];
//     let totalLength = 0;

//     // Lấy ma trận từ bảng HTML
//     const matrix = [];
//     for (let i = 1; i <= numRooms; i++) {
//         matrix[i - 1] = [];
//         for (let j = 1; j <= numRooms; j++) {
//             const value = parseInt(document.querySelector(`#matrix tr:nth-child(${i + 1}) td:nth-child(${j + 1}) input`).value);
//             matrix[i - 1][j - 1] = value;
//             if (i < j && value > 0) {
//                 edges.push([value, i - 1, j - 1]); // Lưu cạnh dưới dạng [trọng số, đỉnh 1, đỉnh 2]
//             }
//         }
//     }

//     // Sắp xếp các cạnh theo trọng số
//     edges.sort((a, b) => a[0] - b[0]);

//     // Hiển thị bảng và tiêu đề khi nhấn nút
//     document.getElementById('sortedEdges').style.display = 'table';
//     document.getElementById('sortedEdgesTitle').style.display = 'block';

//     // Ẩn bảng Prim
//     document.getElementById('primEdges').style.display = 'none';
//     document.getElementById('primEdgesTitle').style.display = 'none';

//     // Hiển thị bảng sắp xếp các cạnh
//     const sortedEdgesTable = document.querySelector("#sortedEdges tbody");
//     sortedEdgesTable.innerHTML = ''; // Xóa bảng cũ

//     // Hàm tìm tập hợp của một đỉnh
//     function find(u) {
//         if (parent[u] === u) return u;
//         return parent[u] = find(parent[u]);
//     }

//     // Hàm liên kết hai định
//     function union(u, v) {
//         const rootU = find(u);
//         const rootV = find(v);
//         if (rootU !== rootV) {
//             parent[rootV] = rootU;
//             return true;
//         }
//         return false;
//     }

//     // Bắt đầu thuật toán Kruskal
//     const stepsDiv = document.getElementById('steps');
//     stepsDiv.innerHTML = ''; // Xóa các bước cũ
//     document.querySelector('.steps').classList.remove('hidden');

//     let edgesAdded = 0; // Biến đếm số cạnh đã thêm vào MST

//     edges.forEach(([weight, u, v]) => {
//         const cycleFormed = !union(u, v); // Kiểm tra chu trình

//         // Cập nhật bảng sortedEdges
//         const row = document.createElement('tr');
//         row.innerHTML = `<td>P${u + 1}</td><td>P${v + 1}</td><td>${weight}</td><td>${cycleFormed ? 'Có' : 'Không'}</td>`;
//         sortedEdgesTable.appendChild(row);

//         if (!cycleFormed) {
//             result.push([u + 1, v + 1, weight]);
//             totalLength += weight;
//             edgesAdded++; // Tăng số lượng cạnh đã thêm

//             // In bước thực hiện
//             const step = document.createElement('p');
//             step.innerText = `Thêm dây giữa phòng P${u + 1} và P${v + 1} với độ dài ${weight}. Tổng độ dài dây điện là: ${totalLength}`;
//             stepsDiv.appendChild(step);
//         }
//         // Không in ra thông điệp nếu MST đã đầy đủ
//         else if (edgesAdded < numRooms - 1) {
//             // In bước bỏ qua cạnh chỉ khi chưa đạt đủ số cạnh
//             const step = document.createElement('p');
//             step.innerText = `Bỏ qua dây giữa phòng P${u + 1} và P${v + 1} vì nó tạo thành chu trình.`;
//             stepsDiv.appendChild(step);
//         }
//     });

//     // In kết quả cuối cùng
//     const finalStep = document.createElement('p');
//     finalStep.innerText = `Cây khung nhỏ nhất có tổng độ dài dây điện là: ${totalLength}`;
//     stepsDiv.appendChild(finalStep);
// }
function primMST() {
    const numRooms = parseInt(document.getElementById('numRooms').value);

    // Lấy ma trận từ bảng HTML
    const matrix = [];
    for (let i = 1; i <= numRooms; i++) {
        matrix[i - 1] = [];
        for (let j = 1; j <= numRooms; j++) {
            const value = parseInt(document.querySelector(`#matrix tr:nth-child(${i + 1}) td:nth-child(${j + 1}) input`).value);
            matrix[i - 1][j - 1] = value;
        }
    }

    const inMST = Array(numRooms).fill(false);
    const key = Array(numRooms).fill(Infinity);
    const parent = Array(numRooms).fill(-1);
    key[0] = 0;
    let totalLength = 0;

    // Reset display
    document.getElementById('steps').innerHTML = '';
    document.querySelector('.steps').classList.remove('hidden');
    const primEdgesTable = document.querySelector("#primEdges tbody");
    primEdgesTable.innerHTML = ''; // Xóa bảng cũ
    document.getElementById('primEdges').style.display = 'table';
    document.getElementById('primEdgesTitle').style.display = 'block';
    document.getElementById('sortedEdges').style.display = 'none';
    document.getElementById('sortedEdgesTitle').style.display = 'none';

    // Tìm đỉnh có key nhỏ nhất mà chưa nằm trong MST
    function minKeyVertex(inMST, key, numRooms) {
        let minKey = Infinity, u = -1;
        for (let v = 0; v < numRooms; v++) {
            if (!inMST[v] && key[v] < minKey) {
                minKey = key[v];
                u = v;
            }
        }
        return u;
    }

    // Cập nhật key và parent
    function updateKeyAndParent(u, matrix, key, parent, inMST, numRooms) {
        for (let v = 0; v < numRooms; v++) {
            if (matrix[u][v] && !inMST[v] && matrix[u][v] < key[v]) {
                parent[v] = u;
                key[v] = matrix[u][v];
            }
        }
    }

    // Hiển thị bước thực hiện và cập nhật bảng
    function displayStepAndTable(parentU, u, weight, totalLength) {
        const step = document.createElement('p');
        step.innerText = `Thêm dây giữa phòng P${parentU + 1} và P${u + 1} với độ dài ${weight}. Tổng độ dài dây điện là: ${totalLength}`;
        document.getElementById('steps').appendChild(step);

        const row = document.createElement('tr');
        row.innerHTML = `<td>P${parentU + 1}</td><td>P${u + 1}</td><td>${weight}</td>`;
        document.querySelector("#primEdges tbody").appendChild(row);
    }

    // Bắt đầu thuật toán Prim
    for (let count = 0; count < numRooms; count++) {
        const u = minKeyVertex(inMST, key, numRooms);
        inMST[u] = true;

        updateKeyAndParent(u, matrix, key, parent, inMST, numRooms);

        if (parent[u] !== -1) {
            totalLength += matrix[u][parent[u]];
            displayStepAndTable(parent[u], u, matrix[u][parent[u]], totalLength);
        }
    }

    // Hiển thị kết quả cuối cùng
    const finalStep = document.createElement('p');
    finalStep.innerText = `Cây khung nhỏ nhất có tổng độ dài dây điện là: ${totalLength}`;
    document.getElementById('steps').appendChild(finalStep);
}
