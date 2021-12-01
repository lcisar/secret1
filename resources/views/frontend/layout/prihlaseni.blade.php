<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="utf-8" />
    <title>Follow clinic | Databáze klientů</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- App favicon -->
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="theme-color" content="#ffffff">

    <!-- App css -->
    <link href="/assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="/assets/css/app.min.css" rel="stylesheet" type="text/css" id="light-style" />
    <link href="/assets/css/app-dark.min.css" rel="stylesheet" type="text/css" id="dark-style" />
    <link href="/assets/css/own.css" rel="stylesheet" type="text/css" />
    <script src="https://code.jquery.com/jquery-3.6.0.slim.js" integrity="sha256-HwWONEZrpuoh951cQD1ov2HUK5zA5DwJ1DNUXaM6FsY=" crossorigin="anonymous"></script>
    <link rel="icon" href="https://www.followclinic.cz/wp-content/uploads/2020/11/favicon-150x150.png" sizes="32x32" />
    <link rel="icon" href="https://www.followclinic.cz/wp-content/uploads/2020/11/favicon-300x300.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="https://www.followclinic.cz/wp-content/uploads/2020/11/favicon-300x300.png" />

    @livewireStyles
</head>

<body class="loading" data-layout="topnav" data-layout-config='{"layoutBoxed":false,"darkMode":false,"showRightSidebarOnStart": true}'>
<div class="wrapper">

    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="content-page">
        <div class="content">

        {{--            @include('frontend.layout.topnav')--}}

        <!-- Start Content-->
            <div class="container-fluid">

                @yield('content')

            </div>
            <!-- container -->

        </div>
        <!-- content -->

        <!-- Footer Start -->
    {{--        <footer class="footer">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6">
                            {{ date('Y') }} ©
                        </div>
                        <div class="col-md-6">

                        </div>
                    </div>
                </div>
            </footer>--}}
    <!-- end Footer -->

    </div>

    <!-- ============================================================== -->
    <!-- End Page content -->
    <!-- ============================================================== -->


</div>
<!-- END wrapper -->

<!-- bundle -->
<script src="/assets/js/vendor.min.js"></script>
<script src="/assets/js/app.min.js"></script>
@stack('scripts')
@livewireScripts
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
<x-livewire-alert::scripts />
</body>

</html>

