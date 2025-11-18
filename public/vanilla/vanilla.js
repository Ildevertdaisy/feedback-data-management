const baseInput = document.getElementById("api-base");
const apiStatus = document.getElementById("api-status");

const byId = (id) => document.getElementById(id);
const setText = (el, text, isError = false) => {
  const target = typeof el === "string" ? byId(el) : el;
  if (!target) return;
  target.textContent = text;
  target.classList.toggle("text-rose-300", isError);
  target.classList.toggle("text-emerald-200", !isError);
};

const valueOrNull = (input) => {
  const value = typeof input === "string" ? byId(input)?.value ?? "" : input?.value ?? "";
  return value.trim() === "" ? null : value.trim();
};

const intOrNull = (input) => {
  const value = valueOrNull(input);
  if (value === null) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const showJson = (id, data) => {
  const target = byId(id);
  if (!target) return;
  target.textContent = JSON.stringify(data, null, 2);
};

const buildBase = () => (baseInput.value || "").replace(/\/$/, "");

async function apiFetch(path, options = {}) {
  const base = buildBase();
  const url = `${base}${path}`;
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);
  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = { message: "Réponse sans JSON", status: response.status };
  }

  if (!response.ok) {
    const message = payload?.detail || payload?.message || response.statusText;
    throw new Error(message);
  }

  return payload;
}

function attachBaseHandlers() {
  byId("reset-base").addEventListener("click", () => {
    baseInput.value = "http://localhost:8000";
    setText(apiStatus, "URL réinitialisée sur http://localhost:8000", false);
  });

  byId("ping-api").addEventListener("click", async () => {
    try {
      setText(apiStatus, "Vérification en cours...");
      const data = await apiFetch("/");
      setText(apiStatus, `API disponible : ${JSON.stringify(data)}`);
    } catch (error) {
      setText(apiStatus, `Erreur : ${error.message}`, true);
    }
  });
}

function attachStudentHandlers() {
  const status = "students-status";
  const output = "students-output";

  byId("students-all").addEventListener("click", async () => {
    try {
      setText(status, "Chargement des étudiants...");
      const data = await apiFetch("/students");
      showJson(output, data);
      setText(status, `${data.length ?? 0} étudiants chargés.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("students-search").addEventListener("click", async () => {
    const name = valueOrNull("student-search");
    if (!name) {
      setText(status, "Veuillez saisir un nom.", true);
      return;
    }
    try {
      setText(status, "Recherche en cours...");
      const data = await apiFetch(`/students/search/name?name=${encodeURIComponent(name)}`);
      showJson(output, data);
      setText(status, `${data.length ?? 0} résultat(s) pour "${name}".`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("students-gender").addEventListener("click", async () => {
    const gender = valueOrNull("student-gender");
    const path = gender ? `/students/filter/gender/${encodeURIComponent(gender)}` : "/students";
    try {
      setText(status, "Filtrage en cours...");
      const data = await apiFetch(path);
      showJson(output, data);
      setText(status, `${data.length ?? 0} étudiant(s) trouvé(s).`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("students-detail").addEventListener("click", async () => {
    const id = intOrNull("student-id");
    if (id === null) {
      setText(status, "ID requis pour récupérer les détails.", true);
      return;
    }
    try {
      setText(status, "Récupération des détails & historique...");
      const detail = await apiFetch(`/students/${id}`);
      const history = await apiFetch(`/students/${id}/history`);
      showJson(output, { detail, history });
      setText(status, `Étudiant #${id} chargé.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("students-abs").addEventListener("click", async () => {
    const min = intOrNull("student-min-abs");
    const query = typeof min === "number" ? `?min_absences=${min}` : "";
    try {
      setText(status, "Analyse des absences...");
      const data = await apiFetch(`/students/analytics/multiple-absences${query}`);
      showJson(output, data);
      setText(status, `Absences multiples récupérées${min ? ` (min ${min})` : ""}.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("student-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      firstname: valueOrNull("student-firstname"),
      gender: valueOrNull("student-form-gender"),
      jdsn: valueOrNull("student-jdsn"),
    };
    const studentId = intOrNull("student-update-id");
    const path = typeof studentId === "number" ? `/students/${studentId}` : "/students";
    const method = typeof studentId === "number" ? "PUT" : "POST";

    try {
      setText("student-form-status", "Envoi en cours...");
      const data = await apiFetch(path, {
        method,
        body: JSON.stringify(payload),
      });
      setText(
        "student-form-status",
        typeof studentId === "number"
          ? `Étudiant #${studentId} mis à jour.`
          : `Étudiant créé : ${JSON.stringify(data)}`,
      );
    } catch (error) {
      setText("student-form-status", error.message, true);
    }
  });

  byId("student-delete").addEventListener("click", async () => {
    const studentId = intOrNull("student-update-id") ?? intOrNull("student-id");
    if (studentId === null) {
      setText("student-form-status", "ID requis pour supprimer.", true);
      return;
    }
    try {
      setText("student-form-status", "Suppression en cours...");
      await apiFetch(`/students/${studentId}`, { method: "DELETE" });
      setText("student-form-status", `Étudiant #${studentId} supprimé.`);
    } catch (error) {
      setText("student-form-status", error.message, true);
    }
  });
}

function attachFruitHandlers() {
  const status = "fruits-status";
  const output = "fruits-output";

  byId("fruits-all").addEventListener("click", async () => {
    const query = buildFruitQuery();
    try {
      setText(status, "Chargement des fruits...");
      const data = await apiFetch(`/fruits${query}`);
      showJson(output, data);
      setText(status, `${data.length ?? 0} fruit(s) chargés.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("fruits-search").addEventListener("click", async () => {
    const name = valueOrNull("fruit-name");
    if (!name) {
      setText(status, "Saisissez un nom pour rechercher.", true);
      return;
    }
    try {
      setText(status, "Recherche en cours...");
      const data = await apiFetch(`/fruits/search/name?name=${encodeURIComponent(name)}`);
      showJson(output, data);
      setText(status, `${data.length ?? 0} résultat(s) pour "${name}".`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("fruits-location").addEventListener("click", async () => {
    const location = valueOrNull("fruit-location");
    const path = location ? `/fruits/filter/location/${encodeURIComponent(location)}` : "/fruits";
    try {
      setText(status, "Filtrage localisation...");
      const data = await apiFetch(path);
      showJson(output, data);
      setText(status, `${data.length ?? 0} fruit(s) trouvés.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("fruits-status").addEventListener("click", async () => {
    const statusValue = valueOrNull("fruit-status");
    const path = statusValue ? `/fruits/filter/status/${encodeURIComponent(statusValue)}` : "/fruits";
    try {
      setText(status, "Filtrage statut...");
      const data = await apiFetch(path);
      showJson(output, data);
      setText(status, `${data.length ?? 0} fruit(s) trouvés.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("fruit-detail").addEventListener("click", async () => {
    const id = intOrNull("fruit-id");
    if (id === null) {
      setText(status, "ID requis.", true);
      return;
    }
    try {
      setText(status, "Récupération du fruit...");
      const data = await apiFetch(`/fruits/${id}`);
      showJson(output, data);
      setText(status, `Fruit #${id} chargé.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("fruit-delete").addEventListener("click", async () => {
    const id = intOrNull("fruit-id");
    if (id === null) {
      setText(status, "ID requis pour suppression.", true);
      return;
    }
    try {
      setText(status, "Suppression en cours...");
      await apiFetch(`/fruits/${id}`, { method: "DELETE" });
      setText(status, `Fruit #${id} supprimé.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("fruit-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      firstname: valueOrNull("fruit-firstname"),
      status: valueOrNull("fruit-status-field"),
      location: valueOrNull("fruit-location-field"),
      indo: intOrNull("fruit-indo-field"),
      tagui_point: valueOrNull("fruit-tagui"),
      date_evangelisation: valueOrNull("fruit-evangelisation"),
      date_subae: valueOrNull("fruit-subae"),
      student_evangelisateur_id: intOrNull("fruit-student-id"),
      rentree_id: intOrNull("fruit-rentree-id"),
      notes: valueOrNull("fruit-notes"),
    };

    const fruitId = intOrNull("fruit-update-id");
    const path = typeof fruitId === "number" ? `/fruits/${fruitId}` : "/fruits";
    const method = typeof fruitId === "number" ? "PUT" : "POST";
    const searchParams = new URLSearchParams();
    if (method === "POST") {
      const check = byId("fruit-duplicates").checked;
      searchParams.set("check_duplicates", String(check));
    }
    const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";

    try {
      setText("fruit-form-status", "Envoi en cours...");
      const data = await apiFetch(`${path}${suffix}`, {
        method,
        body: JSON.stringify(payload),
      });
      setText(
        "fruit-form-status",
        method === "POST"
          ? `Fruit créé : ${JSON.stringify(data)}`
          : `Fruit #${fruitId} mis à jour.`,
      );
    } catch (error) {
      setText("fruit-form-status", error.message, true);
    }
  });
}

function buildFruitQuery() {
  const params = new URLSearchParams();
  const indo = intOrNull("fruit-indo");
  const status = valueOrNull("fruit-status");
  const location = valueOrNull("fruit-location");
  const firstname = valueOrNull("fruit-name");

  if (typeof indo === "number") params.set("indo", indo.toString());
  if (status) params.set("status", status);
  if (location) params.set("location", location);
  if (firstname) params.set("firstname", firstname);

  const query = params.toString();
  return query ? `?${query}` : "";
}

function attachFollowupHandlers() {
  const status = "followup-status";
  const output = "followup-output";

  byId("followup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      fruit_id: intOrNull("followup-fruit"),
      student_id: intOrNull("followup-student"),
      last_date: valueOrNull("followup-date"),
    };

    if (payload.fruit_id === null || payload.student_id === null) {
      setText(status, "Fruit et étudiant requis.", true);
      return;
    }

    try {
      setText(status, "Création du suivi...");
      const data = await apiFetch("/fruits-followups", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setText(status, `Suivi créé : ${JSON.stringify(data)}`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("followup-by-student").addEventListener("click", async () => {
    const id = intOrNull("followup-student");
    if (id === null) {
      setText(status, "ID étudiant requis.", true);
      return;
    }
    try {
      setText(status, "Récupération des suivis étudiant...");
      const data = await apiFetch(`/fruits-followups/student/${id}`);
      showJson(output, data);
      setText(status, `Suivis pour étudiant #${id}.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("followup-by-fruit").addEventListener("click", async () => {
    const id = intOrNull("followup-fruit");
    if (id === null) {
      setText(status, "ID fruit requis.", true);
      return;
    }
    try {
      setText(status, "Récupération des suivis fruit...");
      const data = await apiFetch(`/fruits-followups/fruit/${id}`);
      showJson(output, data);
      setText(status, `Suivis pour fruit #${id}.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("followup-recent").addEventListener("click", async () => {
    try {
      setText(status, "Récupération des suivis récents...");
      const data = await apiFetch("/fruits-followups/recent");
      showJson(output, data);
      setText(status, "Suivis récents chargés (7 jours par défaut).");
    } catch (error) {
      setText(status, error.message, true);
    }
  });
}

function attachRentreeHandlers() {
  const status = "rentrees-status";
  const output = "rentrees-output";

  byId("rentrees-all").addEventListener("click", async () => {
    try {
      setText(status, "Chargement des rentrées...");
      const data = await apiFetch("/rentrees");
      showJson(output, data);
      setText(status, `${data.length ?? 0} rentrée(s) chargée(s).`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("rentree-detail").addEventListener("click", async () => {
    const id = intOrNull("rentree-id");
    if (id === null) {
      setText(status, "ID requis.", true);
      return;
    }
    try {
      setText(status, "Récupération de la rentrée...");
      const data = await apiFetch(`/rentrees/${id}`);
      showJson(output, data);
      setText(status, `Rentrée #${id} récupérée.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("rentree-dashboard").addEventListener("click", async () => {
    const id = intOrNull("rentree-id");
    if (id === null) {
      setText(status, "ID requis pour le dashboard.", true);
      return;
    }
    try {
      setText(status, "Récupération du dashboard...");
      const data = await apiFetch(`/rentrees/${id}/dashboard`);
      showJson(output, data);
      setText(status, `Dashboard pour rentrée #${id}.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("rentrees-dashboards").addEventListener("click", async () => {
    try {
      setText(status, "Récupération des dashboards...");
      const data = await apiFetch("/rentrees/dashboards/all");
      showJson(output, data);
      setText(status, "Dashboards des rentrées chargés.");
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("rentree-chatguis").addEventListener("click", async () => {
    const id = intOrNull("rentree-id");
    if (id === null) {
      setText(status, "ID requis pour les chatguis.", true);
      return;
    }
    try {
      setText(status, "Récupération des chatguis...");
      const data = await apiFetch(`/rentrees/${id}/chatguis`);
      showJson(output, data);
      setText(status, `Chatguis pour rentrée #${id}.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("rentree-fruits").addEventListener("click", async () => {
    const id = intOrNull("rentree-id");
    if (id === null) {
      setText(status, "ID requis.", true);
      return;
    }
    try {
      setText(status, "Récupération des fruits de la rentrée...");
      const data = await apiFetch(`/rentrees/${id}/fruits`);
      showJson(output, data);
      setText(status, `Fruits pour rentrée #${id}.`);
    } catch (error) {
      setText(status, error.message, true);
    }
  });

  byId("rentree-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = {
      date_rentree: valueOrNull("rentree-date"),
      date_debut_chatgui: valueOrNull("rentree-debut"),
      date_fin_chatgui: valueOrNull("rentree-fin"),
      nom_rentree: valueOrNull("rentree-nom"),
      description: valueOrNull("rentree-desc"),
    };

    try {
      setText("rentree-form-status", "Création en cours...");
      const data = await apiFetch("/rentrees", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setText("rentree-form-status", `Rentrée créée : ${JSON.stringify(data)}`);
    } catch (error) {
      setText("rentree-form-status", error.message, true);
    }
  });
}

function init() {
  attachBaseHandlers();
  attachStudentHandlers();
  attachFruitHandlers();
  attachFollowupHandlers();
  attachRentreeHandlers();
  setText(apiStatus, "Prêt à tester vos routes.", false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
