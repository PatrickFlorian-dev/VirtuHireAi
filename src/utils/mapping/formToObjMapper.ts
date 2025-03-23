import { RegisterFormInputs } from "../../interfaces/forms/registerFormInputs";

export const mapRegisterFormToUser = (data: RegisterFormInputs) => {
    return {
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      roleId: data.roleId,
    };
  };