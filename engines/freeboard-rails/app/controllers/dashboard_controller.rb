class DashboardController < ApplicationController
  before_action :dashboard_params, only: [:create]
  before_action :authenticate_user!, except: [:show]
  before_action :set_dashboard, only: [:destroy, :update]
  skip_before_filter :verify_authenticity_token, :only => [:update]


  def index
    @dashboards = Dashboard.where(user: current_user).reverse
    @dashboard = Dashboard.new
  end

  def create
    @dashboard = Dashboard.new(dashboard_params)
    @dashboard[:user] = current_user
    if @dashboard.save
      redirect_to :dashboard_index, notice: 'Dashboard was successfully created.'
    else
      redirect_to :dashboard_index, alert: (@dashboard.errors ? @dashboard.errors.full_messages.first : 'Error occurred' )
    end
  end

  def show
    @dashboard = Dashboard.find(params[:id])
    # check visibility of dashboard
    if @dashboard.visibility.to_s == 'private'
      # user should be logged in and associated with params id
      authenticate_user!
      set_dashboard
      raise 'Naughty... Naughty...' if @dashboard.nil?
    end
    render :layout => false
  end

  # PATCH/PUT /dashboard/:id.json
  def update
    dashboard_data = params[:dashboard][:data]
    raise 'Naughty.... Naughty...' if @dashboard.nil?
    @dashboard[:data] = dashboard_data.to_hash
    if @dashboard.save
      render json: {status: 'success', data: 'Dashboard was saved.'}
    else
      render json: {status: 'error', data: @dashboard.errors }
    end
  end

  def destroy
    @dashboard.destroy
    redirect_to :dashboard_index, notice: 'Dashboard was successfully destroyed.'
  end

  private
  def dashboard_params
    params.require(:dashboard).permit(:name, :visibility)
  end

  def set_dashboard
    @dashboard = Dashboard.where({user: current_user, id: params[:id]}).first
  end
end
