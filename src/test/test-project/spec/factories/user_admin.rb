FactoryBot.define do
  factory :user_admin, class: "User" do
    email { 'admin@admin.com' }
    password { 'superadminpassword' }
  end
end
