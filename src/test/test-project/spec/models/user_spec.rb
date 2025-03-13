RSpec.describe User do
    subject(:user) { build(:user) }
    let(:product) { build(:product) }
    create(:user)

    it "has an email" do
        expect(user.email).not_to be_empty
    end
end
