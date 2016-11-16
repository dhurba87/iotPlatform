class Dashboard
  include Mongoid::Document
  field :name, type: String
  field :visibility, type: String
  field :data, type: Hash
  belongs_to :user

  validates :name, presence: true

  # enum :visibility, [:public, :private], validate: true
  # TODO:: validate visibility
end
