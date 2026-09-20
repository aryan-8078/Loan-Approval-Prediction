const API_URL = "http://127.0.0.1:5000/predict";


const loanForm = document.getElementById("loanForm");

const predictButton =
    document.getElementById("predictButton");

const buttonText =
    document.getElementById("buttonText");

const buttonSpinner =
    document.getElementById("buttonSpinner");

const resetButton =
    document.getElementById("resetButton");

const loading =
    document.getElementById("loading");

const result =
    document.getElementById("result");

const resultIcon =
    document.getElementById("resultIcon");

const predictionText =
    document.getElementById("predictionText");

const probabilityText =
    document.getElementById("probabilityText");

const probabilityBar =
    document.getElementById("probabilityBar");



/* =========================
   PREDICTION
========================= */

loanForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const applicantData = {

            gender:
                document.getElementById("gender").value,

            married:
                document.getElementById("married").value,

            dependents:
                document.getElementById("dependents").value,

            education:
                document.getElementById("education").value,

            self_employed:
                document.getElementById("self_employed").value,

            applicantincome:
                Number(
                    document.getElementById(
                        "applicantincome"
                    ).value
                ),

            coapplicantincome:
                Number(
                    document.getElementById(
                        "coapplicantincome"
                    ).value
                ),

            loanamount:
                Number(
                    document.getElementById(
                        "loanamount"
                    ).value
                ),

            loan_amount_term:
                Number(
                    document.getElementById(
                        "loan_amount_term"
                    ).value
                ),

            credit_history:
                Number(
                    document.getElementById(
                        "credit_history"
                    ).value
                ),

            property_area:
                document.getElementById(
                    "property_area"
                ).value
        };


        /* Show loading */

        predictButton.disabled = true;

        buttonText.textContent = "Analyzing...";

        buttonSpinner.classList.remove("hidden");

        loading.classList.remove("hidden");

        result.classList.add("hidden");


        try {

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            applicantData
                        )
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Prediction failed."
                );
            }


            /* Get values */

            const prediction =
                data.prediction;

            const probability =
                Number(
                    data.approval_probability
                );


            /* Reset result classes */

            result.classList.remove(
                "approved",
                "rejected"
            );


            /* Approved */

            if (
                prediction ===
                "Loan Approved"
            ) {

                result.classList.add(
                    "approved"
                );

                resultIcon.textContent = "✓";

            }


            /* Not Approved */

            else {

                result.classList.add(
                    "rejected"
                );

                resultIcon.textContent = "×";

            }


            /* Display prediction */

            predictionText.textContent =
                prediction;


            /* Display probability */

            probabilityText.textContent =
                probability.toFixed(2) + "%";


            /* Animate progress bar */

            probabilityBar.style.width =
                "0%";


            result.classList.remove(
                "hidden"
            );


            setTimeout(
                function () {

                    probabilityBar.style.width =
                        probability + "%";

                },
                100
            );


        }

        catch (error) {

            result.classList.remove(
                "approved",
                "rejected"
            );

            result.classList.add(
                "rejected"
            );

            resultIcon.textContent = "!";

            predictionText.textContent =
                "Prediction Error";

            probabilityText.textContent = "";

            probabilityBar.style.width =
                "0%";

            result.classList.remove(
                "hidden"
            );

            console.error(
                "Prediction error:",
                error
            );

        }


        /* Hide loading */

        loading.classList.add(
            "hidden"
        );

        predictButton.disabled =
            false;

        buttonText.textContent =
            "Predict Loan Approval";

        buttonSpinner.classList.add(
            "hidden"
        );

    }
);



/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    function () {

        loanForm.reset();

        result.classList.add(
            "hidden"
        );

        result.classList.remove(
            "approved",
            "rejected"
        );

        probabilityBar.style.width =
            "0%";

        probabilityText.textContent =
            "0%";

    }
);