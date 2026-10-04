
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
)

from xgboost import XGBClassifier


def train_models(df):
    # Check required dataset columns
    required_columns = [
        "Festival",
        "Location",
        "Media_Count",
        "Category",
    ]

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing dataset columns: {missing_columns}"
        )

    # Keep required columns and remove incomplete rows
    data = df[required_columns].dropna().copy()

    if len(data) < 5:
        raise ValueError(
            "Dataset has too few rows. Add more festival records."
        )

    X = data[["Festival", "Location", "Media_Count"]]

    # Encode category names as numeric labels
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(data["Category"])

    number_of_classes = len(label_encoder.classes_)

    if number_of_classes < 2:
        raise ValueError(
            "At least two different categories are required."
        )

    # Ensure the test set can contain every class
    class_counts = {
        int(class_id): int(count)
        for class_id, count in zip(
            *__import__("numpy").unique(y, return_counts=True)
        )
    }

    test_count = max(
        int(round(len(data) * 0.3)),
        number_of_classes,
    )

    if min(class_counts.values()) < 2:
        raise ValueError(
            "Some categories have fewer than 2 records. "
            "Add more records for each category before training."
        )

    if test_count >= len(data):
        raise ValueError(
            "Dataset is too small for a train/test split."
        )

    # Stratified split keeps categories represented in both sets
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_count,
        random_state=42,
        stratify=y,
    )

    models = {
        "Logistic Regression": LogisticRegression(
            max_iter=1000
        ),

        "Decision Tree": DecisionTreeClassifier(
            random_state=42
        ),

        "Random Forest": RandomForestClassifier(
            n_estimators=100,
            random_state=42,
        ),

        "XGBoost": XGBClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.1,
            objective="multi:softprob",
            num_class=number_of_classes,
            eval_metric="mlogloss",
            random_state=42,
        ),
    }

    results = {}
    confusion_matrices = {}

    for name, model in models.items():
        # Preprocess categorical and numerical features
        preprocessor = ColumnTransformer(
            transformers=[
                (
                    "categorical",
                    OneHotEncoder(handle_unknown="ignore"),
                    ["Festival", "Location"],
                )
            ],
            remainder="passthrough",
        )

        pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("model", model),
        ])

        # XGBoost requires consecutive class labels in training
        if name == "XGBoost":
            xgb_encoder = LabelEncoder()
            y_train_model = xgb_encoder.fit_transform(y_train)

            pipeline.fit(X_train, y_train_model)

            encoded_predictions = pipeline.predict(X_test)
            predictions = xgb_encoder.inverse_transform(
                encoded_predictions.astype(int)
            )
        else:
            pipeline.fit(X_train, y_train)
            predictions = pipeline.predict(X_test)

        # Calculate evaluation metrics
        results[name] = {
            "Accuracy": accuracy_score(
                y_test, predictions
            ),
            "Precision": precision_score(
                y_test,
                predictions,
                average="weighted",
                zero_division=0,
            ),
            "Recall": recall_score(
                y_test,
                predictions,
                average="weighted",
                zero_division=0,
            ),
            "F1-score": f1_score(
                y_test,
                predictions,
                average="weighted",
                zero_division=0,
            ),
        }

        # Use all known category labels for consistent matrices
        confusion_matrices[name] = confusion_matrix(
            y_test,
            predictions,
            labels=list(range(number_of_classes)),
        ).tolist()

    return results, confusion_matrices