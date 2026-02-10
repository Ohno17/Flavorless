![Game screenshot](image.png)
An incremental game about coding in BF to collect more currency and increase your production of value.

## How to Play

### Objective
The goal of the game is to write BF programs to move numbers from various cells to the **goal cell** (marked with subscript goal). 

* **Workers:** Indicated with a superscript $. Their position represents the current data pointer.
* **Currency:** Any value deposited into the goal cell is converted into currency.
* **Value Conservation:** Unlike traditional BF, `+` and `-` do not create or destroy value. They transfer value between the cell and the worker’s "held" inventory. You cannot deposit what you don't have.
* **Progression:** Levels are unlocked based on the **total number of commands executed**, regardless of the specific command or the program's output.
* **Worker Reset:** When a program finishes, the worker becomes inactive. Reactivating them manually resets their location, but they **retain** any value they were holding.
* **The Generator:** Random cells receive value over time via the "Generator." You can upgrade its speed and the amount it distributes.
* **Scaling:** Every level increases the size of the data array by 1.

---

### Operations

| Command | Action |
| :--- | :--- |
| `+` | **Deposit:** Move 1 unit from held value to the current cell. |
| `-` | **Take:** Move 1 unit from the current cell to held value. |
| `>` | **Move Right:** Shift the worker's location to the right. |
| `<` | **Move Left:** Shift the worker's location to the left. |
| `[` | **Open Loop:** Start of a conditional block. |
| `]` | **Standard Close:** Jump back to `[` if the value in the **current cell** is not zero. |
| `}` | **Special Close:** Jump back to `[` if the **held value** is not zero. |
| `.` | **Output:** Print the current cell's value to the console. |
| `!` | **Alert:** Print "Alert!" to the console. |

---

## Features

* **Multi-Worker Management:** Manage multiple workers simultaneously to optimize the collection of values from the generator and delivery to the goal.
* **Other Types of Looping:** The addition of the `}` operator allows for complex logic where a worker can continue moving or acting until their hands are empty, independent of the cell values they pass over.

## Details

Created using HTML/CSS/JS. 
