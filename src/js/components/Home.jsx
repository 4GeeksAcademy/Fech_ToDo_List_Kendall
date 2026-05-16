
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";





const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [list, setList] = useState([]);
	const [beVisible, setBeVisible] = useState(null);
	const idCounter = useRef(0)

	useEffect(() => {

		const raw = "";

		const requestOptions = {
			method: "POST",
			body: raw,
			redirect: "follow"
		};

		fetch("https://playground.4geeks.com/todo/users/kendallsh", requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));

		const getContent = async () => {

			try {
				let response = await fetch("https://playground.4geeks.com/todo/users/kendallsh")
				let data = await response.json()
				setList(data.todos)
			} catch (error) {
				console.error(error);
			}
		}
		getContent()
	}, [])

	const addTodo = async (input) => {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			"label": input,
			"is_done": false
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch("https://playground.4geeks.com/todo/todos/kendallsh", requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.error(error));
	}


	const handleSubmit = (evn) => {
		evn.preventDefault();
		if (inputValue.trim() === "") return;
		setInputValue("");
		setList([
			...list,
			{ key: idCounter.current++, value: inputValue }

		]);
	}

	return (
		<div className="d-flex justify-content-center mt-5">
			<div className="card shadow-sm d-inline-block">
				<div className="card-body">

					<h2 className="text-center mb-4">To-Do List</h2>

					<form onSubmit={handleSubmit}>
						<input
							type="text"
							className="form-control form-control-lg mb-4"
							value={inputValue}
							onChange={(evn) => setInputValue(evn.target.value)}
						/>
					</form>
					<ul className="list-group gap-2">
						{list.map((item) => (
							<li key={item.key}
								className="list-group-item d-flex justify-content-between align-items-center"
								onMouseEnter={() => setBeVisible(item.key)}
								onMouseLeave={() => setBeVisible(null)}
							>
								{item.label}
								{beVisible === item.key && (
									<button
										className="btn btn-sm btn-outline-danger border-0"
										onClick={() =>
											setList(list.filter((listItem) => listItem.key !== item.key))
										}
									>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								)}
							</li>
						))}
					</ul>

				</div>
				<div className="container text-muted ">
					{list.length === 0 ? "No hay tareas, añadir tareas" : null}
				</div>
				<div className="card-footer text-muted small">
					{list.length} {list.length === 1 ? "item" : "items"} left

				</div>
			</div>
		</div>
	);
};

export default Home;