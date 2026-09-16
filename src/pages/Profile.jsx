import AccountSidebar from "../components/AccountSidebar";

export default function Profile() {
  return (
    <main className="account-page">
      <AccountSidebar active="profile" />
      <section className="account-content">
        <p className="eyebrow">Account settings</p>
        <h2>Edit profile</h2>
        <div className="account-form">
          <label className="field-label">
            Full name
            <input defaultValue="Mitchell Admin" />
          </label>
          <label className="field-label">
            Email
            <input defaultValue="mitchelladmin2017@gmail.com" />
          </label>
          <label className="field-label">
            Old password
            <input type="password" />
          </label>
          <label className="field-label">
            New password
            <input type="password" />
          </label>
          <button className="button button-dark">Save changes</button>
        </div>
      </section>
    </main>
  );
}
