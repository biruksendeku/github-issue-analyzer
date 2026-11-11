import { AppError } from "./custom.js";

const getErrorDetails = (err) => {
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
    };
  }

  if (err.name === "ValidationError") {
    return {
      statusCode: 400,
      message: "Some of the information you submitted isn’t valid.",
    };
  }

  if (err.code === 11000) {
    return {
      statusCode: 409,
      message: "An account with that information already exists.",
    };
  }

  return {
    statusCode: 500,
    message: "Something went wrong while handling your request.",
  };
};

const getErrorPresentation = (statusCode) => {
  if (statusCode === 400) {
    return {
      title: "Check your details",
      guidance: "Review the information and try again.",
    };
  }
  if (statusCode === 401 || statusCode === 403) {
    return {
      title: "You can’t access this yet",
      guidance: "Sign in with a verified account, then try again.",
    };
  }
  if (statusCode === 404) {
    return {
      title: "We couldn’t find that",
      guidance:
        "Check the address, or return to your issue dashboard and choose a repository from there.",
    };
  }
  if (statusCode === 409) {
    return {
      title: "That information is already in use",
      guidance: "Sign in to your existing account or use different details.",
    };
  }
  return {
    title: "Something went wrong",
    guidance: "Please try again in a moment. Your work has not been changed.",
  };
};

const errorHandler = async (err, req, res, next) => {
  const { statusCode, message } = getErrorDetails(err);
  const presentation = getErrorPresentation(statusCode);

  if (statusCode >= 500) {
    console.error("Request failed:", err);
  }

  const wantsHtml =
    req.accepts(["html", "json"]) === "html" && !req.is("json");

  if (wantsHtml) {
    return res.status(statusCode).render("errors/error", {
      statusCode,
      title: presentation.title,
      message,
      guidance: presentation.guidance,
      isAuthenticated: req.isAuthenticated?.() ?? false,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
