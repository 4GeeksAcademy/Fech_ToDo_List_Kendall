
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const Home = () => {
	const [inputValue, setInputValue] = useState("")
	const [list, setList] = useState([])
	const [beVisible, setBeVisible] = useState(null)

	useEffect(() => {

		const getContent = async () => {

			try {
				const response = await fetch("https://playground.4geeks.com/todo/users/kendallsh")
				if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

				const data = await response.json()
				setList(data.todos || [])
			} catch (error) {
				console.error(error);
			}
		}
		getContent()
	}, [])

	const addTodo = async (input) => {
		try {
			const response = await fetch('https://playground.4geeks.com/todo/todos/kendallsh', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ label: input, is_done: false })
			});
			if (!response.ok) throw new Error(`Error al crear: ${response.status}`);

			const data = await response.json();
			return data;
			console.log('Task create:', data);
		} catch (error) {
			console.error('Error en el POST:', error.message);
			throw error
		}
	};

	const handleSubmit = async (evn) => {
		evn.preventDefault();
		if (inputValue.trim() === "") return;

		const currentInput = inputValue;
		setInputValue("");

		try {

			const newTodoFromServer = await addTodo(currentInput);

			setList([
				...list,
				newTodoFromServer
			]);
		} catch (error) {
			console.error("No se pudo guardar en el servidor:", error);
			setInputValue(currentInput); // Opcional: recupera el texto si falló
		}
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
							<li key={item.id}
								className="list-group-item d-flex justify-content-between align-items-center"
								onMouseEnter={() => setBeVisible(item.id)}
								onMouseLeave={() => setBeVisible(null)}
							>
								{item.label}
								{beVisible === item.id && (
									<button
										className="btn btn-sm btn-outline-danger border-0"
										onClick={() =>
											setList(list.filter((listItem) => listItem.id !== item.id))
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