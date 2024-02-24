import { readAuth } from "../../readAuth";
import { UserClient } from "./User";

export default async function User({ params }: { params: { id: string } }) {
  const auth = await readAuth();

  if (auth.user.id !== params.id) {
    return <>You Do Not Have Permission To View This User</>;
  }

  return <UserClient />;
}
