import {
  ActionFunction,
  Form,
  json,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import FullPageLayout from "~/components/FullPageLayout";
import Logo from "~/components/Logo";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { InputError, InputField } from "./tracks/new";
import { emailRegex } from "~/constant/emailRegex";
import { register } from "~/utils/user";
import { useEffect } from "react";

type ActionData = {
  fields?: {
    email: string;
    fullname: string;
    password: string;
  };
  fieldErrors?: {
    fullname: string | undefined;
    email: string | undefined;
    password: string | undefined;
  };
  formError?: string;
};

const validateName = (fullname: unknown) => {
  if (typeof fullname !== "string" || fullname.length < 2) {
    return `Hmm! C'mon that's not even a name.`;
  }
};

const validateEmail = (email: unknown) => {
  if (typeof email !== "string" || email.length < 3) {
    return `Is that a real email?`;
  }

  let reg = new RegExp(emailRegex);

  if (!reg.test(email)) {
    return `Is that a real email?`;
  }
};

const validatePassword = (password: unknown) => {
  if (typeof password !== "string" || password.length < 6) {
    return `Invalid password`;
  }
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const formdata = await request.formData();

  const fullname = formdata.get("fullname");
  const email = formdata.get("email");
  const password = formdata.get("password");

  if (
    typeof fullname !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  let fields = {
    fullname,
    email,
    password,
  };

  let fieldErrors = {
    fullname: validateName(fullname),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  //   try registerting a new user
  const newUser = await register({ fullname, email, password });

  //   if null, that means email already existed
  if (!newUser) {
    return badRequest({
      fields,
      fieldErrors: {
        fullname: "",
        email: `That email exits already. May be you can try logging in.`,
        password: "",
      },
    });
  }

  //   new user created, redirect to /tracks for now
  return redirect("/tracks");
};

export default function RegisterRoute() {
  const actionData = useActionData();
  const state = useTransition();

  const isLoadingNewPage =
    state.state === "submitting" && state.type === "actionSubmission";

  const isBusy = state.state === "submitting";

  useEffect(() => {
    console.table(state);
  }, [state]);

  return (
    <FullPageLayout>
      <div className="flex items-center justify-center  py-12">
        <Logo />
      </div>
      <Form
        method="post"
        className="bg-white bg-opacity-5 border-b border-indigo-500 flex flex-col space-y-6 p-4 rounded-lg overflow-hidden w-1/2 max-w-lg mx-auto my-6"
        aria-describedby={actionData?.formError ? "form-error-message" : ""}
      >
        <p className="text-white font-medium text-lg text-center border-b border-indigo-200 pb-4">
          Ahoy! Good to see you hear 😎
        </p>
        {actionData?.formError ? (
          <p className="bg-red-200 text-red-600 p-3 rounded overflow-hidden text-base leading-snug font-normal flex items-start space-x-2">
            <ExclamationCircleIcon className="text-current w-4 h-4" />
            <span className="text-sm">{actionData.formError}</span>
          </p>
        ) : null}
        <div className="text-sm text-center">
          <p>Let us get to know you better.</p>
        </div>
        <div>
          <label className="text-sm">
            Your Cool Name:{" "}
            <InputField
              defaultValue={actionData?.fields?.fullname ?? ""}
              type="text"
              name="fullname"
              aria-invalid={Boolean(actionData?.fieldErrors?.email)}
              aria-describedby={
                actionData?.fieldErrors?.fullname ? "name invalid" : ""
              }
            />
          </label>
          {actionData?.fieldErrors?.fullname ? (
            <InputError errorMessage={actionData.fieldErrors.fullname} />
          ) : null}
        </div>
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
          <small className="text-xs leading-tight block w-11/12 mt-1 opacity-70">
            Password must be atleast 6 characters long and must contain
            combination of alphanumerics and symbols.
          </small>
          {actionData?.fieldErrors?.password ? (
            <InputError errorMessage={actionData.fieldErrors.password} />
          ) : null}
        </div>
        <button
          className={
            "bg-white rounded-md p-2 px-3 font-medium text-lg text-indigo-900 hover:shadow-lg  text-center" +
            (isBusy ? " opacity-50" : "")
          }
          type="submit"
          disabled={isBusy}
        >
          {isBusy ? "Submitting" : "Register"}
        </button>
        <small className="mt-2 text-gray-400 text-center">
          Already a member?{" "}
          <a className="text-white underline" href="/login">
            {" "}
            Login here
          </a>
        </small>
      </Form>
    </FullPageLayout>
  );
}
