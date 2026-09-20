from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load the trained ML model
model = joblib.load("loan_approval_model.pkl")


@app.route("/")
def home():
    return jsonify({
        "message": "Loan Approval Prediction API is running!"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:
        # Get applicant data from frontend
        data = request.get_json()

        # Create DataFrame
        applicant = pd.DataFrame({
            "gender": [data["gender"]],
            "married": [data["married"]],
            "dependents": [data["dependents"]],
            "education": [data["education"]],
            "self_employed": [data["self_employed"]],
            "applicantincome": [data["applicantincome"]],
            "coapplicantincome": [data["coapplicantincome"]],
            "loanamount": [data["loanamount"]],
            "loan_amount_term": [data["loan_amount_term"]],
            "credit_history": [data["credit_history"]],
            "property_area": [data["property_area"]]
        })

        # Feature Engineering
        applicant["total_income"] = (
            applicant["applicantincome"]
            + applicant["coapplicantincome"]
        )

        applicant["loan_to_income"] = (
            applicant["loanamount"]
            / applicant["total_income"]
        )

        # Make prediction
        prediction = model.predict(applicant)[0]

        # Get prediction probabilities
        probabilities = model.predict_proba(applicant)[0]

        approval_probability = probabilities[
            list(model.classes_).index("y")
        ]

        # Convert model output to user-friendly result
        if prediction == "y":
            result = "Loan Approved"
        else:
            result = "Loan Not Approved"

        return jsonify({
            "prediction": result,
            "approval_probability": round(
                float(approval_probability) * 100, 2
            )
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)