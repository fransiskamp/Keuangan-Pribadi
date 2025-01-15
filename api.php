<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get all transactions
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM transactions ORDER BY date DESC";
    $result = $conn->query($sql);
    $transactions = [];
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }
    }
    
    echo json_encode($transactions);
}

// Add new transaction
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $type = $conn->real_escape_string($data['type']);
    $category = $conn->real_escape_string($data['category']);
    $amount = $conn->real_escape_string($data['amount']);
    $date = $conn->real_escape_string($data['date']);
    
    $sql = "INSERT INTO transactions (type, category, amount, date) VALUES ('$type', '$category', $amount, '$date')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Transaction added successfully', 'id' => $conn->insert_id]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}

// Update transaction
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id = $conn->real_escape_string($data['id']);
    $type = $conn->real_escape_string($data['type']);
    $category = $conn->real_escape_string($data['category']);
    $amount = $conn->real_escape_string($data['amount']);
    $date = $conn->real_escape_string($data['date']);
    
    $sql = "UPDATE transactions SET type='$type', category='$category', amount=$amount, date='$date' WHERE id=$id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Transaction updated successfully']);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}

// Delete transaction
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    
    $sql = "DELETE FROM transactions WHERE id=$id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Transaction deleted successfully']);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}

$conn->close();
?>