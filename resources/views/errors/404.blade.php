@extends('frontend.layout.master')
@section('content')
    <div class="row mt-2">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    @if(isset($data))
                        <h2 class="header-title text-uppercase text-danger">{{ $data['nadpis'] }}</h2>
                        <div class="alert alert-warning">{{ $data['text'] }}</div>
                    @else
                        <h6 class="header-title">Stránka nenalezena</h6>
                        Pokračujte prosím na <a href="{{ URL::to('/') }}">úvodní stránku</a>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
