
const $ = id => document.getElementById(id);

const G = 6.67430e-11;
const C = 299792458;
const MS = 1.98847e30;
const H = 1.054571817e-34;
const K = 1.380649e-23;

const criticalImpact = 3 * Math.sqrt(3) / 2;

const n = (v, d = 3) =>
    Number(v).toLocaleString("en-US", {
        maximumFractionDigits: d
    });

const massKg = m => m * 1e6 * MS;
const schwarzschildRadius = m => 2 * G * massKg(m) / C ** 2;

function ctx(id) {
    return $(id).getContext("2d");
}

function background(c, w, h) {
    c.clearRect(0, 0, w, h);
    c.fillStyle = "#080f1d";
    c.fillRect(0, 0, w, h);
}

function text(c, s, x, y, color = "#dce9fb", size = 15) {
    c.fillStyle = color;
    c.font = size + "px Arial";
    c.fillText(s, x, y);
}

function line(c, x, y, X, Y, color = "#8297b5", width = 2, dash = []) {
    c.beginPath();
    c.setLineDash(dash);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.moveTo(x, y);
    c.lineTo(X, Y);
    c.stroke();
    c.setLineDash([]);
}

// MODULE NAVIGATION

document.querySelectorAll(".tab").forEach(button => {
    button.onclick = () => {
        document.querySelectorAll(".tab").forEach(b =>
            b.classList.toggle("active", b === button)
        );

        document.querySelectorAll(".panel").forEach(panel =>
            panel.classList.toggle("active", panel.id === button.dataset.id)
        );

        drawAll();
    };
});

// MODULE 1: SCHWARZSCHILD GEOMETRY

function geometry() {
    const m = +$("mass").value;
    const r = +$("emit").value;

    const z = 1 / Math.sqrt(1 - 1 / r) - 1;

    $("gm").textContent = n(m, 1);
    $("er").textContent = n(r, 2);

    $("rs").textContent =
        n(schwarzschildRadius(m) / 1000, 0) + " km";

    $("z").textContent = n(z, 5);
    $("freq").textContent = n(1 / (1 + z), 5);

    const c = ctx("geometryCanvas");
    background(c, 700, 400);

    for (let j = 0; j < 9; j++) {
        c.beginPath();
        c.strokeStyle = "#29435e";

        for (let x = 0; x < 700; x += 4) {
            const y = 55 + j * 36 +
                Math.exp(-((x - 350) / 110) * 2) *
                ((j % 2 ? 1 : -1) * 40);

            x ? c.lineTo(x, y) : c.moveTo(x, y);
        }

        c.stroke();
    }

    c.strokeStyle = "#ffad58";
    c.lineWidth = 12;
    c.beginPath();
    c.ellipse(350, 210, 110, 34, -0.1, 0, 7);
    c.stroke();

    c.fillStyle = "#000";
    c.beginPath();
    c.arc(350, 210, 42, 0, 7);
    c.fill();

    c.strokeStyle = "#dce9fb";
    c.lineWidth = 2;
    c.stroke();

    c.setLineDash([6, 5]);
    c.strokeStyle = "#7bdcff";
    c.beginPath();
    c.arc(350, 210, 65, 0, 7);
    c.stroke();
    c.setLineDash([]);

    text(c, "Event horizon", 405, 218);
    text(c, "Accretion disc (schematic)", 465, 130, "#ffbd70");
}

$("mass").oninput = geometry;
$("emit").oninput = geometry;

// MODULE 2: NULL GEODESICS

function light() {
    const b = +$("impact").value;

    const outcome =
        b < criticalImpact ? "Captured" :
        Math.abs(b - criticalImpact) < 0.025 ? "Critical approach" :
        "Scattered";

    $("ib").textContent = n(b, 2);
    $("outcome").textContent = outcome;

    const c = ctx("lightCanvas");
    background(c, 700, 400);

    c.fillStyle = "#000";
    c.beginPath();
    c.arc(350, 205, 48, 0, 7);
    c.fill();

    c.strokeStyle = "#ffad58";
    c.lineWidth = 7;
    c.beginPath();
    c.ellipse(350, 205, 130, 38, -0.1, 0, 7);
    c.stroke();

    c.setLineDash([6, 5]);
    c.strokeStyle = "#c18cff";
    c.lineWidth = 2;
    c.beginPath();
    c.arc(350, 205, 72, 0, 7);
    c.stroke();
    c.setLineDash([]);

    c.strokeStyle = "#7bdcff";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(12, 110);

    if (outcome === "Captured") {
        c.bezierCurveTo(170, 110, 230, 165, 300, 200);
        c.lineTo(340, 210);
    } else if (outcome === "Critical approach") {
        c.bezierCurveTo(180, 110, 250, 75, 300, 110);
        c.bezierCurveTo(410, 150, 420, 270, 390, 285);
    } else {
        c.bezierCurveTo(170, 110, 250, 65, 330, 95);
        c.bezierCurveTo(470, 130, 560, 230, 690, 270);
    }

    c.stroke();

    text(c, "Photon sphere = 1.5 rₛ", 18, 30, "#c18cff");
    text(c, "Illustrative path · " + outcome, 18, 55);
}

$("impact").oninput = light;

// MODULE 3: PARTICLE ORBITS

function orbit() {
    const r = +$("orbit").value;

    const stability =
        r >= 3 ? "Stable circular orbit" :
        r > 1.5 ? "Unstable circular orbit" :
        "No timelike circular orbit";

    $("orb").textContent = n(r, 2);
    $("stability").textContent = stability;

    const c = ctx("orbitCanvas");
    background(c, 700, 400);

    c.strokeStyle = "#c18cff";
    c.setLineDash([6, 5]);
    c.beginPath();
    c.arc(350, 200, 72, 0, 7);
    c.stroke();
    c.setLineDash([]);

    c.strokeStyle = "#ffad58";
    c.lineWidth = 7;
    c.beginPath();
    c.ellipse(350, 200, 120, 34, -0.1, 0, 7);
    c.stroke();

    c.fillStyle = "#000";
    c.beginPath();
    c.arc(350, 200, 48, 0, 7);
    c.fill();

    c.strokeStyle = r >= 3 ? "#9cf0bd" : "#ff7777";
    c.lineWidth = 3;
    c.beginPath();
    c.arc(350, 200, r * 48, 0, 7);
    c.stroke();

    text(c, "Selected orbit: " + n(r, 2) + " rₛ", 18, 30);
    text(c, "ISCO = 3 rₛ · Photon sphere = 1.5 rₛ", 18, 55);
}

$("orbit").oninput = orbit;

// MODULE 4: SPACETIME COORDINATES

const coordinateInfo = {
    sch: "Schwarzschild coordinates describe the exterior well, but their metric coefficients appear singular at r = rₛ. This is a coordinate singularity, not a physical curvature singularity at the horizon.",

    ef: "Ingoing Eddington–Finkelstein coordinates use an ingoing null coordinate and remain regular at the future event horizon, allowing infalling trajectories to cross it.",

    kr: "Kruskal–Szekeres coordinates provide a horizon-regular extension of the ideal Schwarzschild solution. This simplified Penrose-style diagram sketches horizons, exterior and singularity."
};

function spacetime() {
    const mode = $("coord").value;
    const c = ctx("spaceCanvas");

    background(c, 850, 430);

    if (mode === "sch") {
        line(c, 80, 360, 800, 360);
        line(c, 80, 360, 80, 40);
        line(c, 80, 280, 800, 280, "#ffbd70", 3, [8, 5]);

        for (let i = 0; i < 5; i++) {
            c.beginPath();
            c.strokeStyle = "#7bdcff";
            c.moveTo(130 + i * 140, 350);
            c.bezierCurveTo(
                160 + i * 140, 250,
                190 + i * 140, 130,
                230 + i * 140, 55
            );
            c.stroke();
        }

        text(c, "r = rₛ : coordinate horizon", 100, 270, "#ffbd70");

    } else if (mode === "ef") {
        line(c, 80, 360, 800, 360);
        line(c, 80, 360, 80, 40);
        line(c, 80, 280, 800, 280, "#ffbd70", 3, [8, 5]);

        for (let i = 0; i < 6; i++) {
            line(c, 130 + i * 110, 60, 220 + i * 110, 360, "#7bdcff");
        }

        line(c, 510, 50, 510, 360, "#9cf0bd", 4);

        text(c, "Horizon: regular crossing", 100, 270, "#ffbd70");
        text(c, "Ingoing direction", 530, 90, "#9cf0bd");

    } else {
        c.beginPath();
        c.moveTo(425, 30);
        c.lineTo(780, 210);
        c.lineTo(425, 390);
        c.lineTo(70, 210);
        c.closePath();

        c.strokeStyle = "#7bdcff";
        c.lineWidth = 2;
        c.stroke();

        line(c, 70, 210, 780, 210, "#ffbd70", 3, [7, 5]);
        line(c, 300, 325, 425, 390, "#ff7777", 5);
        line(c, 425, 390, 550, 325, "#ff7777", 5);

        text(c, "Future null infinity", 345, 24, "#9cf0bd");
        text(c, "Event horizon", 90, 195, "#ffbd70");
        text(c, "Event horizon", 670, 195, "#ffbd70");
        text(c, "Singularity (schematic)", 325, 420, "#ff9999");
    }

    $("coordInfo").textContent = coordinateInfo[mode];
}

$("coord").onchange = spacetime;

// MODULE 5: THERMODYNAMICS

function thermodynamics() {
    const m = +$("tMass").value;
    const kg = massKg(m);

    const radius = schwarzschildRadius(m);
    const area = 4 * Math.PI * radius ** 2;

    const temperature =
        H * C ** 3 / (8 * Math.PI * G * kg * K);

    const entropy =
        K * C ** 3 * area / (4 * G * H);

    const surfaceGravity =
        C ** 4 / (4 * G * kg);

    $("tm").textContent = n(m, 1);
    $("temp").textContent = temperature.toExponential(4) + " K";
    $("entropy").textContent = entropy.toExponential(4) + " J/K";
    $("surface").textContent = surfaceGravity.toExponential(4) + " m/s²";

    const c = ctx("chart");
    background(c, 700, 350);

    line(c, 55, 300, 670, 300);
    line(c, 55, 300, 55, 35);

    c.beginPath();
    c.strokeStyle = "#ffbd70";
    c.lineWidth = 2;

    for (let i = 0; i <= 100; i++) {
        const x = i / 100;
        const mass = 1 + x * 9999;
        const y = 300 - (1 / mass) * 265;

        if (i === 0) c.moveTo(55 + x * 615, y);
        else c.lineTo(55 + x * 615, y);
    }

    c.stroke();

    c.beginPath();
    c.strokeStyle = "#7bdcff";
    c.lineWidth = 2;

    for (let i = 0; i <= 100; i++) {
        const x = i / 100;
        const mass = 1 + x * 9999;
        const y = 300 - (mass / 10000) ** 2 * 265;

        if (i === 0) c.moveTo(55 + x * 615, y);
        else c.lineTo(55 + x * 615, y);
    }

    c.stroke();

    text(c, "Temperature decreases with mass", 70, 25, "#ffbd70", 13);
    text(c, "Entropy increases with mass²", 70, 45, "#7bdcff", 13);
}

$("tMass").oninput = thermodynamics;

$("sgr").onclick = () => {
    $("tMass").value = 4.3;
    thermodynamics();
};

$("m87").onclick = () => {
    $("tMass").value = 6500;
    thermodynamics();
};

// MODULE 6: QUANTUM PHYSICS

const quantumText = {
    field: "In quantum field theory on curved spacetime, the black-hole background changes how field modes are defined. Hawking radiation emerges from this quantum-field calculation. The familiar particle-pair explanation is a heuristic analogy.",

    evap: "For an ideal Schwarzschild black hole, Hawking temperature is proportional to 1/M. As mass decreases, predicted temperature rises. This is a trend illustration, not a realistic evaporation timeline.",

    info: "The information paradox asks how quantum information is preserved if black-hole evaporation appears to turn an initial quantum state into thermal radiation. It remains an important theoretical problem."
};

function quantum() {
    const mode = $("qmode").value;
    const c = ctx("quantumCanvas");

    background(c, 700, 400);

    $("qinfo").textContent = quantumText[mode];
    $("evapControls").hidden = mode !== "evap";

    if (mode === "field") {
        c.fillStyle = "#000";
        c.beginPath();
        c.arc(350, 205, 55, 0, 7);
        c.fill();

        c.strokeStyle = "#ffad58";
        c.lineWidth = 8;
        c.beginPath();
        c.ellipse(350, 205, 165, 45, -0.1, 0, 7);
        c.stroke();

        c.setLineDash([6, 5]);
        c.strokeStyle = "#7bdcff";
        c.beginPath();
        c.arc(350, 205, 75, 0, 7);
        c.stroke();
        c.setLineDash([]);

        line(c, 405, 190, 610, 65, "#9cf0bd", 3);
        line(c, 310, 230, 180, 350, "#ff8888", 3);

        text(c, "Quantum field near horizon", 18, 30);
        text(c, "Outgoing mode (conceptual)", 440, 85, "#9cf0bd", 14);

    } else if (mode === "evap") {
        const m = +$("evap").value;

        $("em").textContent = m;
        $("et").textContent = (1 / m).toFixed(3) + " × reference";

        line(c, 60, 330, 650, 330);
        line(c, 60, 330, 60, 45);

        c.beginPath();
        c.strokeStyle = "#ffbd70";
        c.lineWidth = 4;

        for (let i = 0; i <= 100; i++) {
            const x = i / 100;
            const mass = m * (1 - .85 * x);
            const y = 330 - (1 / mass) * m * 180;

            if (i === 0) c.moveTo(60 + x * 580, y);
            else c.lineTo(60 + x * 580, y);
        }

        c.stroke();
        text(c, "Temperature rises as mass decreases", 80, 30, "#ffbd70");

    } else {
        c.strokeStyle = "#7bdcff";
        c.lineWidth = 2;
        c.strokeRect(30, 95, 270, 205);

        c.strokeStyle = "#ffbd70";
        c.strokeRect(400, 95, 270, 205);

        text(c, "Initial quantum state", 55, 130, "#7bdcff", 18);
        text(c, "Information in correlations", 55, 190);

        text(c, "Outgoing radiation", 430, 130, "#ffbd70", 18);
        text(c, "Appears thermal", 445, 190);

        line(c, 305, 200, 395, 200, "#9cf0bd", 3);
        text(c, "?", 342, 185, "#9cf0bd", 28);

        text(c, "Where did the information go?", 205, 355);
    }
}

$("qmode").onchange = quantum;
$("evap").oninput = quantum;

// REFRESH ALL MODULES

function drawAll() {
    geometry();
    light();
    orbit();
    spacetime();
    thermodynamics();
    quantum();
}

drawAll();
