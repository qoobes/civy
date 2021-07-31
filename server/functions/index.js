const functions = require("firebase-functions");
const axios = require("axios").default;
const cors = require("cors")({ origin: true });
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const v4 = require("uuid").v4;

exports.getMonths = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		const { budgets, category, date } = request.body;

		try {
			const res = await axios.post("http://144.126.219.175/predict", {
				budgetList: budgets,
				monthToPredict: date,
				category,
			});
			response.json({ budget: res.data.budget });
		} catch (e) {
			console.log(e);
		}
	});
});

exports.addTaskToList = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		const { name, checked, tags, company } = request.body;

		if (name.length < 5) {
			response
				.status(400)
				.json({ message: "Name to short, please enter a longer name" });
		}

		if (!checked) {
			response
				.status(400)
				.json({ message: "Please enter a checked status for the properties" });
		}

		const id = v4();

		const task = firebase
			.firestore()
			.collection(`/companies/${company.id}/tasks`)
			.doc(id)
			.set({
				name,
				checked,
				tags: tags
					.trim()
					.join(",")
					.map(t => t.trim().toLowerCase()),
			});

		response.json({ success: true, task });
	});
});

exports.addNote = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		const { content, tags, company } = request.body;

		if (content.length < 5) {
			response.status(400).json({
				message:
					"Content too short; Please give us more information so we can create a note!",
			});
		}

		const id = v4();

		const note = firebase
			.firestore()
			.collection(`/companies/${company.id}/notes`)
			.doc(id)
			.set({
				name,
				checked,
				tags: tags
					.trim()
					.join(",")
					.map(t => t.trim().toLowerCase()),
			});

		response.json({ success: true, note });
	});
});

exports.removeNote = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		const { companyId, noteId } = request.body;

		if (!companyId || !noteId) {
			response.status(400).json({
				message:
					"Pleas provide a company id and a note id so we know which note to delte!",
				success: false,
			});
			return;
		}

		const note = firebase
			.firestore()
			.collection(`/companies/${company.id}/notes`)
			.doc(noteId)
			.delete();

		response.json({ success: true, note });
	});
});

exports.removeTask = functions.https.onRequest(async (request, response) => {
	cors(request, response, async () => {
		const { companyId, noteId: taskId } = request.body;

		if (!companyId || !taskId) {
			response.status(400).json({
				message:
					"Pleas provide a company id and a task id so we know which note to delte!",
				success: false,
			});
			return;
		}

		const task = firebase
			.firestore()
			.collection(`/companies/${company.id}/notes`)
			.doc(taskId)
			.delete();

		response.json({ success: true, task });
	});
});
