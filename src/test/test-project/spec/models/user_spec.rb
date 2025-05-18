RSpec.describe User do
  subject(:user) { build(:user) }
  let(:product) { build(:product) }
  let(:user2) { create :user }
  let(:user_admin) { FactoryBot.build(:user_admin) }
  let(:users) { create_list(:user, 2) }
  let(:no_user) { create(:no_user) }

  it 'has an email' do
    expect(user.email).not_to be_empty
  end
end
