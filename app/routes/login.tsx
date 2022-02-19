import { ActionFunction, Form, json, redirect, useActionData } from "remix";
import FullPageLayout from "~/components/FullPageLayout";
import Logo from "~/components/Logo";
import { emailRegex } from "~/constant/emailRegex";
import { login } from "~/utils/user";
import { InputError, InputField } from "./tracks/new";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

type ActionData = {
  fields?: {
    email: string;
    password: string;
  };
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  formError?: string | undefined;
};

const validateEmail = function (email: unknown) {
  let regex = new RegExp(emailRegex);

  if (typeof email !== "string" || email.length < 3) {
    return `Email must be atleast 3 characters long`;
  }

  let lowercasedEmail = email.toLowerCase();

  if (!regex.test(lowercasedEmail)) {
    return `Please enter a valid email`;
  }
};

const validatePassword = function (password: unknown) {
  if (typeof password !== "string" || password.length < 3) {
    return `Password must be atleast 3 characters long`;
  }
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  let fields = {
    email,
    password,
  };

  let fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  //   attempt to login
  const user = await login({ email, password });

  if (!user) {
    return badRequest({
      formError: `Email/password combination seems incorrect`,
      fields,
    });
  }

  //   instead of redirect create a user session and redirect in that func

  return redirect("/tracks");
};

export default function LoginRoute() {
  const actionData = useActionData<ActionData>();
  return (
    <FullPageLayout>
      <div className="flex items-center justify-center  py-12">
        <Logo />
      </div>
      <Form
        method="post"
        className="bg-white bg-opacity-5 border-b border-indigo-500 flex flex-col space-y-6 p-4 rounded-lg overflow-hidden w-1/2 max-w-lg mx-auto mt-6"
        aria-describedby={actionData?.formError ? "form-error-message" : ""}
      >
        <p className="text-white font-medium text-lg text-center border-b border-indigo-200 pb-4">
          Welcome back 👋
        </p>
        {actionData?.formError ? (
          <p className="bg-red-200 text-red-600 p-3 rounded overflow-hidden text-base leading-snug font-normal flex items-start space-x-2">
            <ExclamationCircleIcon className="text-current w-4 h-4" />
            <span className="text-sm">{actionData.formError}</span>
          </p>
        ) : null}
        <div>
          <label className="text-sm">
            Email:{" "}
            <InputField
              defaultValue={actionData?.fields?.email ?? ""}
              type="text"
              name="email"
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              aria-describedby={
                actionData?.fieldErrors?.email ? "email invalid" : ""
              }
            />
          </label>
          {actionData?.fieldErrors?.email ? (
            <InputError errorMessage={actionData.fieldErrors.email} />
          ) : null}
        </div>
        <div>
          <label className="text-sm">
            Password:{" "}
            <InputField
              defaultValue={actionData?.fields?.password ?? ""}
              aria-invalid={Boolean(actionData?.fields?.password)}
              aria-describedby={
                actionData?.fields?.password ? "password-invalid" : ""
              }
              type="password"
              name="password"
            />
          </label>
          {actionData?.fieldErrors?.password ? (
            <InputError errorMessage={actionData.fieldErrors.password} />
          ) : null}
        </div>
        <button
          className="bg-white rounded-md p-2 px-3 font-medium text-lg text-indigo-900 hover:shadow-lg  text-center"
          type="submit"
        >
          Login
        </button>
        <small className="mt-2 text-gray-400 text-center">
          New member?{" "}
          <a className="text-white underline" href="/register">
            {" "}
            Register here
          </a>
        </small>
      </Form>
    </FullPageLayout>
  );
}
