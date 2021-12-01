<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- App favicon -->
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="theme-color" content="#ffffff">

    <!-- App css -->
    <link href="/assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="/assets/css/app.min.css" rel="stylesheet" type="text/css" id="light-style" />

    <link href="/assets/css/own.css" rel="stylesheet" type="text/css" />

</head>

<body class="loading" data-layout="topnav" data-layout-config='{"layoutBoxed":false,"darkMode":false,"showRightSidebarOnStart": false}'>
<div class="wrapper">

    <div class="content-page">
        <div class="content">
            @include('frontend.layout.topbar')
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

</div>

<script src="/assets/js/vendor.min.js"></script>
<script src="/assets/js/app.min.js"></script>

</body>

</html>

